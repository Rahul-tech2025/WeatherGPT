const mlService = require('../services/ml.service');

class MLController {
  /**
   * Health check for ML Service
   */
  async getHealth(req, res, next) {
    try {
      const health = await mlService.getHealth();
      res.status(200).json(health);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get model metrics and evaluation benchmarks
   */
  async getMetrics(req, res, next) {
    try {
      const metrics = await mlService.getMetrics();
      res.status(200).json({
        status: 'success',
        data: metrics
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Predict next-day temperature & rainfall for given coordinates / city
   * GET /api/ml/predict?lat=31.3256&lon=75.5792&city=Jalandhar
   */
  async predictForLocation(req, res, next) {
    try {
      const { lat, lon, city } = req.query;

      if (!lat || !lon) {
        return res.status(400).json({
          status: 'error',
          message: 'Both "lat" and "lon" query parameters are required'
        });
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          status: 'error',
          message: 'Latitude and longitude must be valid floating numbers'
        });
      }

      const cityName = city || 'Custom Location';
      const prediction = await mlService.predictForCity(cityName, latitude, longitude);

      res.status(200).json({
        status: 'success',
        data: prediction
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Custom direct daily prediction with user-provided weather history
   * POST /api/ml/predict/daily
   */
  async predictDirect(req, res, next) {
    try {
      const { city, target_date, history } = req.body;

      if (!history || !Array.isArray(history) || history.length < 3) {
        return res.status(400).json({
          status: 'error',
          message: 'Field "history" must be an array with at least 3 daily weather observations'
        });
      }

      const result = await mlService.predictDirectDaily({ city, target_date, history });
      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MLController();
