const aiService = require('../services/ai.service');

class AIController {
  /**
   * Conversational Weather Chat endpoint
   * POST /api/ai/chat
   * Body: { message: string, city?: string, latitude?: number, longitude?: number, history?: Array }
   */
  async chat(req, res, next) {
    try {
      const { message, city, latitude, longitude, history } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Field "message" is required'
        });
      }

      const response = await aiService.chat({
        message,
        city,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        history
      });

      res.status(200).json({
        status: 'success',
        data: response
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
