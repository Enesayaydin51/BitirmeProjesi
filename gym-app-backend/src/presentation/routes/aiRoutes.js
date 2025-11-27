const express = require('express');
const AIController = require('../controllers/AIController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const aiController = new AIController();

// Tüm AI route'ları authentication gerektirir
router.use(authMiddleware);

// AI endpoints
router.post('/nutrition-question', aiController.answerQuestion.bind(aiController));
router.post('/nutrition-plan', aiController.generatePlan.bind(aiController));
router.post('/food-suggestions', aiController.suggestFoods.bind(aiController));

module.exports = router;

