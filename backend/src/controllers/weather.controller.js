const weatherService = require('../services/weather.service');

class WeatherController {
  /**
   * GET /api/weather/search?city=...
   */
  async search(req, res, next) {
    try {
      const { city, count } = req.query;
      if (!city) {
        return res.status(400).json({
          status: 'fail',
          message: 'Query parameter "city" is required'
        });
      }

      const results = await weatherService.searchCities(city, count ? parseInt(count) : 5);
      return res.status(200).json({
        status: 'success',
        resultsCount: results.length,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/weather/current?lat=...&lon=...
   */
  async getCurrent(req, res, next) {
    try {
      const { lat, lon } = req.query;
      if (lat === undefined || lon === undefined) {
        return res.status(400).json({
          status: 'fail',
          message: 'Latitude (lat) and Longitude (lon) parameters are required'
        });
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Latitude and Longitude must be valid numbers'
        });
      }

      const weather = await weatherService.getCurrentWeather(latitude, longitude);
      return res.status(200).json({
        status: 'success',
        data: weather
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/weather/forecast?lat=...&lon=...
   */
  async getForecast(req, res, next) {
    try {
      const { lat, lon } = req.query;
      if (lat === undefined || lon === undefined) {
        return res.status(400).json({
          status: 'fail',
          message: 'Latitude (lat) and Longitude (lon) parameters are required'
        });
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          status: 'fail',
          message: 'Latitude and Longitude must be valid numbers'
        });
      }

      const forecast = await weatherService.getForecast(latitude, longitude);
      return res.status(200).json({
        status: 'success',
        data: forecast
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/weather/history?lat=...&lon=...&days=... (or &startDate=...&endDate=...)
   */
  async getHistory(req, res, next) {
    try {
      const { lat, lon, days, startDate, endDate } = req.query;
      if (lat === undefined || lon === undefined) {
        return res.status(400).json({
          status: 'fail',
          message: 'Latitude (lat) and Longitude (lon) parameters are required'
        });
      }

      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);

      let start = startDate;
      let end = endDate;

      // If days count is provided (e.g. days=7), calculate past days
      if (days && !start && !end) {
        const numDays = parseInt(days) || 7;
        const now = new Date();
        const endD = new Date(now.getTime() - 24 * 60 * 60 * 1000); // yesterday
        const startD = new Date(now.getTime() - numDays * 24 * 60 * 60 * 1000);
        start = startD.toISOString().slice(0, 10);
        end = endD.toISOString().slice(0, 10);
      }

      if (!start || !end) {
        return res.status(400).json({
          status: 'fail',
          message: 'Either days count (e.g. days=7) or startDate & endDate (YYYY-MM-DD) are required'
        });
      }

      const history = await weatherService.getHistoricalWeather(latitude, longitude, start, end);
      return res.status(200).json({
        status: 'success',
        data: history
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WeatherController();
