const AIService = require('../../infrastructure/services/AIService');
const UserRepository = require('../../infrastructure/repositories/UserRepository');

class AIController {
  constructor() {
    this.aiService = new AIService();
    this.userRepository = new UserRepository();
  }

  /**
   * @swagger
   * /api/ai/nutrition-question:
   *   post:
   *     summary: AI ile beslenme sorusu sor
   *     description: Kullanıcının beslenme sorusuna AI ile cevap verir
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - question
   *             properties:
   *               question:
   *                 type: string
   *                 example: "Günde kaç kalori almalıyım?"
   *     responses:
   *       200:
   *         description: AI cevabı
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  async answerQuestion(req, res, next) {
    try {
      const { question } = req.body;
      const userId = req.user.id;

      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Soru gereklidir',
        });
      }

      // Kullanıcı bilgilerini al
      const user = await this.userRepository.findById(userId);
      const userDetails = await this.userRepository.getUserDetails(userId);

      const userContext = {
        goal: userDetails?.goal || null,
        height: userDetails?.height || null,
        weight: userDetails?.weight || null,
        injuries: userDetails?.injuries || [],
      };

      const answer = await this.aiService.answerNutritionQuestion(question, userContext);

      res.status(200).json({
        success: true,
        data: {
          question,
          answer,
        },
      });
    } catch (error) {
      console.error('AI question error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/ai/nutrition-plan:
   *   post:
   *     summary: AI ile kişiselleştirilmiş beslenme planı oluştur
   *     description: Kullanıcı bilgilerine göre özel beslenme planı oluşturur
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Beslenme planı
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  async generatePlan(req, res, next) {
    try {
      const userId = req.user.id;

      // Kullanıcı bilgilerini al
      const user = await this.userRepository.findById(userId);
      const userDetails = await this.userRepository.getUserDetails(userId);

      const userContext = {
        goal: userDetails?.goal || 'Kilo Koruma',
        height: userDetails?.height || 175,
        weight: userDetails?.weight || 70,
        injuries: userDetails?.injuries || [],
      };

      const plan = await this.aiService.generateNutritionPlan(userContext);

      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      console.error('AI plan generation error:', error);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/ai/food-suggestions:
   *   post:
   *     summary: AI ile yemek önerileri al
   *     description: Kriterlere göre yemek önerileri getirir
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - criteria
   *             properties:
   *               criteria:
   *                 type: string
   *                 example: "yüksek protein, düşük kalori"
   *     responses:
   *       200:
   *         description: Yemek önerileri listesi
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  async suggestFoods(req, res, next) {
    try {
      const { criteria } = req.body;
      const userId = req.user.id;

      if (!criteria || criteria.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Kriter gereklidir',
        });
      }

      // Kullanıcı bilgilerini al
      const userDetails = await this.userRepository.getUserDetails(userId);

      const userContext = {
        goal: userDetails?.goal || null,
        injuries: userDetails?.injuries || [],
      };

      const foods = await this.aiService.suggestFoods(criteria, userContext);

      res.status(200).json({
        success: true,
        data: {
          criteria,
          foods,
        },
      });
    } catch (error) {
      console.error('AI food suggestions error:', error);
      next(error);
    }
  }
}

module.exports = AIController;

