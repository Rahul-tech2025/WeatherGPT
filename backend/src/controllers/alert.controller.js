const Alert = require('../models/Alert');
const weatherService = require('../services/weather.service');
const { getDBStatus } = require('../config/db');

// In-memory alert store fallback if MongoDB is not connected
const inMemoryAlerts = [];

class AlertController {
  /**
   * Create a new weather alert threshold
   * POST /api/alerts
   */
  async createAlert(req, res, next) {
    try {
      const { cityName, latitude, longitude, conditionType, thresholdValue } = req.body;
      const userEmail = req.user?.email || 'guest@weathergpt.local';

      if (!cityName || latitude === undefined || longitude === undefined || !conditionType) {
        return res.status(400).json({
          status: 'error',
          message: 'cityName, latitude, longitude, and conditionType are required'
        });
      }

      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        const alert = await Alert.create({
          userId: req.user?.id || null,
          userEmail,
          cityName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          conditionType,
          thresholdValue: thresholdValue ? parseFloat(thresholdValue) : 0
        });

        return res.status(201).json({ status: 'success', data: alert });
      } else {
        const alert = {
          _id: 'alert_' + Date.now(),
          userEmail,
          cityName,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          conditionType,
          thresholdValue: thresholdValue ? parseFloat(thresholdValue) : 0,
          isActive: true,
          createdAt: new Date()
        };
        inMemoryAlerts.push(alert);
        return res.status(201).json({ status: 'success', data: alert });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * List user alerts
   * GET /api/alerts
   */
  async getAlerts(req, res, next) {
    try {
      const userEmail = req.user?.email || 'guest@weathergpt.local';
      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        const alerts = await Alert.find({ userEmail, isActive: true });
        return res.status(200).json({ status: 'success', data: alerts });
      } else {
        const alerts = inMemoryAlerts.filter(a => a.userEmail === userEmail && a.isActive);
        return res.status(200).json({ status: 'success', data: alerts });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an alert
   * DELETE /api/alerts/:id
   */
  async deleteAlert(req, res, next) {
    try {
      const { id } = req.params;
      const dbConnected = getDBStatus().connected;

      if (dbConnected) {
        await Alert.findByIdAndDelete(id);
      } else {
        const idx = inMemoryAlerts.findIndex(a => a._id === id);
        if (idx !== -1) inMemoryAlerts.splice(idx, 1);
      }

      return res.status(200).json({ status: 'success', message: 'Alert deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Evaluate all user alerts against live weather conditions
   * GET /api/alerts/check
   */
  async checkAlerts(req, res, next) {
    try {
      const userEmail = req.user?.email || 'guest@weathergpt.local';
      const dbConnected = getDBStatus().connected;

      const alerts = dbConnected
        ? await Alert.find({ userEmail, isActive: true })
        : inMemoryAlerts.filter(a => a.userEmail === userEmail && a.isActive);

      const triggeredAlerts = [];

      for (const alert of alerts) {
        try {
          const weather = await weatherService.getCurrentWeather(alert.latitude, alert.longitude);
          const current = weather.current;
          let isTriggered = false;
          let triggerReason = '';

          switch (alert.conditionType) {
            case 'rain':
              if (current.precipitation > 0 || current.rain > 0 || current.category === 'Rain') {
                isTriggered = true;
                triggerReason = `Rain detected in ${alert.cityName} (${current.precipitation} mm)`;
              }
              break;
            case 'temp_high':
              if (current.temperature >= alert.thresholdValue) {
                isTriggered = true;
                triggerReason = `Temperature in ${alert.cityName} reached ${current.temperature}°C (Threshold: ${alert.thresholdValue}°C)`;
              }
              break;
            case 'temp_low':
              if (current.temperature <= alert.thresholdValue) {
                isTriggered = true;
                triggerReason = `Temperature in ${alert.cityName} dropped to ${current.temperature}°C (Threshold: ${alert.thresholdValue}°C)`;
              }
              break;
            case 'wind_high':
              if (current.windSpeed >= alert.thresholdValue) {
                isTriggered = true;
                triggerReason = `Wind speed in ${alert.cityName} reached ${current.windSpeed} km/h (Threshold: ${alert.thresholdValue} km/h)`;
              }
              break;
          }

          if (isTriggered) {
            triggeredAlerts.push({
              alertId: alert._id,
              cityName: alert.cityName,
              condition: alert.conditionType,
              reason: triggerReason,
              currentValue: current.temperature,
              timestamp: new Date().toISOString()
            });
          }
        } catch (e) {
          console.warn(`Failed checking alert for ${alert.cityName}:`, e.message);
        }
      }

      return res.status(200).json({
        status: 'success',
        activeAlertsCount: alerts.length,
        triggeredCount: triggeredAlerts.length,
        triggeredAlerts
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AlertController();
