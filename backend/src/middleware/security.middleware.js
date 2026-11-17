/**
 * WeatherGPT Security Middleware Suite
 * Provides comprehensive enterprise-grade protection:
 * 1. Security Headers (Anti-Clickjacking, Anti-MIME Sniffing, XSS filtering, HSTS)
 * 2. Sliding Window Rate Limiting (Anti-DoS / Brute-force protection)
 * 3. Deep NoSQL / MongoDB Operator Injection Sanitization
 * 4. Request parameter normalization & payload sanitization
 */

// In-memory rate limiting store with automatic TTL garbage collection
const rateLimitStore = new Map();

// Periodic GC every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Factory for creating rate limiters
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum allowed requests within the window
 * @param {string} message - Custom error message
 */
function createRateLimiter(windowMs = 60 * 1000, maxRequests = 100, message = 'Too many requests from this IP, please try again shortly.') {
  return (req, res, next) => {
    // Extract client IP safely (supports proxies)
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const key = `${req.baseUrl || ''}:${clientIp}`;
    const now = Date.now();

    let record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', resetSeconds);

    if (record.count > maxRequests) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(429).json({
        status: 'error',
        code: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfterSeconds: resetSeconds,
      });
    }

    next();
  };
}

/**
 * Comprehensive HTTP Security Headers Middleware
 */
function securityHeaders(req, res, next) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // XSS protection legacy filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Enforce modern referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Restrict sensitive browser features
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // HTTP Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Hide server technology
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * Deep NoSQL & Query Injection Sanitizer
 * Recursively removes keys containing '$' or '.' to prevent MongoDB operator injection
 */
function sanitizeInput(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  }

  const clean = {};
  for (const key of Object.keys(obj)) {
    // Strip keys with mongo operators ($gt, $ne, $where, etc.) or path traversal dots
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = sanitizeInput(obj[key]);
  }
  return clean;
}

function injectionSanitizer(req, res, next) {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
}

module.exports = {
  createRateLimiter,
  securityHeaders,
  injectionSanitizer,
  standardLimiter: createRateLimiter(60 * 1000, 120, 'Request limit reached. Please wait a moment.'),
  aiChatLimiter: createRateLimiter(60 * 1000, 30, 'AI query frequency limit reached. Please wait 1 minute before asking more questions.'),
  authLimiter: createRateLimiter(15 * 60 * 1000, 20, 'Too many authentication attempts. Please try again after 15 minutes.'),
};
