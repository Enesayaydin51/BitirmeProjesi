const CreateUserUseCase = require('../../application/use-cases/CreateUserUseCase');
const LoginUserUseCase = require('../../application/use-cases/LoginUserUseCase');
const UserRepository = require('../../infrastructure/repositories/UserRepository');

class AuthController {
  constructor() {
    this.userRepository = new UserRepository();
    this.createUserUseCase = new CreateUserUseCase(this.userRepository);
    this.loginUserUseCase = new LoginUserUseCase(this.userRepository);

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.updateUserDetails = this.updateUserDetails.bind(this);
  }

  async register(req, res, next) {
    try {
      const userData = req.body;
      const result = await this.createUserUseCase.execute(userData);
      return res.status(201).json({ success: true, message: "User created successfully", data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const loginData = req.body;
      const result = await this.loginUserUseCase.execute(loginData);
      return res.status(200).json({ success: true, message: "Login successful", data: result });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.userRepository.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async getUserDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const details = await this.userRepository.getUserDetails(userId);
      res.status(200).json({ success: true, data: details });
    } catch (error) {
      next(error);
    }
  }

  async updateUserDetails(req, res, next) {
    try {
      const userId = req.user.id;
      const { height, weight, injuries } = req.body;
      const updated = await this.userRepository.updateUserDetails(userId, { height, weight, injuries });
      res.status(200).json({ success: true, message: "User details updated", data: updated });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();