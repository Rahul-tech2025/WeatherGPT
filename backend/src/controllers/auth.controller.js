const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'weathergpt_dev_secret_key_12345';

// In-memory user cache fallback if MongoDB is not yet running
const inMemoryUsers = new Map();

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
};

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide name, email, and password'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          status: 'error',
          message: 'Password must be at least 6 characters long'
        });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
          return res.status(400).json({
            status: 'error',
            message: 'An account with this email already exists'
          });
        }

        const user = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password
        });

        const token = generateToken(user._id, user.email);

        return res.status(201).json({
          status: 'success',
          message: 'User registered successfully 🎉',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            preferredUnit: user.preferredUnit,
            favoriteCities: user.favoriteCities
          }
        });
      } else {
        // In-memory fallback
        if (inMemoryUsers.has(normalizedEmail)) {
          return res.status(400).json({
            status: 'error',
            message: 'An account with this email already exists (demo session)'
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const tempId = 'user_' + Date.now();
        const memoryUser = {
          id: tempId,
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          preferredUnit: 'C',
          favoriteCities: []
        };
        inMemoryUsers.set(normalizedEmail, memoryUser);

        const token = generateToken(tempId, normalizedEmail);

        return res.status(201).json({
          status: 'success',
          message: 'User registered in memory session (MongoDB standby) 🎉',
          token,
          user: {
            id: tempId,
            name: memoryUser.name,
            email: memoryUser.email,
            preferredUnit: memoryUser.preferredUnit,
            favoriteCities: memoryUser.favoriteCities
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Log in user
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Please provide email and password'
        });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if (!user) {
          return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password'
          });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password'
          });
        }

        const token = generateToken(user._id, user.email);

        return res.status(200).json({
          status: 'success',
          message: 'Login successful 🌤️',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            preferredUnit: user.preferredUnit,
            favoriteCities: user.favoriteCities
          }
        });
      } else {
        // In-memory fallback
        const user = inMemoryUsers.get(normalizedEmail);
        if (!user) {
          return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password (demo session)'
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({
            status: 'error',
            message: 'Invalid email or password (demo session)'
          });
        }

        const token = generateToken(user.id, user.email);

        return res.status(200).json({
          status: 'success',
          message: 'Login successful (demo session) 🌤️',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            preferredUnit: user.preferredUnit,
            favoriteCities: user.favoriteCities
          }
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getMe(req, res, next) {
    try {
      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        return res.status(200).json({ status: 'success', user });
      } else {
        const user = inMemoryUsers.get(req.user.email);
        if (!user) {
          return res.status(404).json({ status: 'error', message: 'User not found in demo session' });
        }
        const { password, ...safeUser } = user;
        return res.status(200).json({ status: 'success', user: safeUser });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add a favorite city
   * POST /api/auth/favorites
   */
  async addFavorite(req, res, next) {
    try {
      const city = req.body;
      if (!city || !city.name || city.latitude === undefined || city.longitude === undefined) {
        return res.status(400).json({ status: 'error', message: 'Valid city object required' });
      }

      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        const alreadyExists = user.favoriteCities.some(c => c.name.toLowerCase() === city.name.toLowerCase());
        if (!alreadyExists) {
          user.favoriteCities.push(city);
          await user.save();
        }

        return res.status(200).json({ status: 'success', favoriteCities: user.favoriteCities });
      } else {
        const user = inMemoryUsers.get(req.user.email);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        const alreadyExists = user.favoriteCities.some(c => c.name.toLowerCase() === city.name.toLowerCase());
        if (!alreadyExists) {
          user.favoriteCities.push(city);
        }

        return res.status(200).json({ status: 'success', favoriteCities: user.favoriteCities });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a favorite city
   * DELETE /api/auth/favorites/:cityName
   */
  async removeFavorite(req, res, next) {
    try {
      const cityName = decodeURIComponent(req.params.cityName);
      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        user.favoriteCities = user.favoriteCities.filter(c => c.name.toLowerCase() !== cityName.toLowerCase());
        await user.save();

        return res.status(200).json({ status: 'success', favoriteCities: user.favoriteCities });
      } else {
        const user = inMemoryUsers.get(req.user.email);
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

        user.favoriteCities = user.favoriteCities.filter(c => c.name.toLowerCase() !== cityName.toLowerCase());
        return res.status(200).json({ status: 'success', favoriteCities: user.favoriteCities });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
