const CreateUserUseCase = require('../../application/use-cases/CreateUserUseCase');
const LoginUserUseCase = require('../../application/use-cases/LoginUserUseCase');
const UserRepository = require('../../infrastructure/repositories/UserRepository');

class AuthController {
  constructor() {
    this.userRepository = new UserRepository();
    this.createUserUseCase = new CreateUserUseCase(this.userRepository);
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository);
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     description: Create a new user account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - firstName
   *               - lastName
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 example: "password123"
   *               firstName:
   *                 type: string
   *                 example: "John"
   *               lastName:
   *                 type: string
   *                 example: "Doe"
   *               phoneNumber:
   *                 type: string
   *                 example: "+905551234567"
   *               dateOfBirth:
   *                 type: string
   *                 format: date
   *                 example: "1990-01-01"
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  async register(req, res, next) {
    try {
      console.log('Register request received:', req.body);
      const userData = req.body;
      const result = await this.createUserUseCase.execute(userData);
      
      console.log('User created successfully:', result);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result
      });
    } catch (error) {
      console.error('Register error:', error);
      console.error('Error stack:', error.stack);
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login user
   *     description: Authenticate user and return JWT token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "user@example.com"
   *               password:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                     token:
   *                       type: string
   *       401:
   *         description: Invalid credentials
   *       500:
   *         description: Internal server error
   */
  async login(req, res, next) {
    try {
      const loginData = req.body;
      const result = await this.loginUserUseCase.execute(loginData);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const userDetails = await this.userRepository.getUserDetails(userId);
      
      res.status(200).json({
        success: true,
        data: userDetails
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const { height, weight, injuries } = req.body;
      
      const userDetails = await this.userRepository.updateUserDetails(userId, {
        height: parseInt(height),
        weight: parseFloat(weight),
        injuries: injuries || []
      });
      
      res.status(200).json({
        success: true,
        message: 'User details updated successfully',
        data: userDetails
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
