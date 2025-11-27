const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Kullanıcı kimlik doğrulama işlemleri
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı oluşturur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Efe Şahin
 *               email:
 *                 type: string
 *                 example: efe@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla kaydedildi
 *       400:
 *         description: Eksik veya hatalı bilgi
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kullanıcı girişi yapar
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: efe@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *       401:
 *         description: Yetkisiz giriş
 */
router.post('/login', authController.login);

module.exports = router;
