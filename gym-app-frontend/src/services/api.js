import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class ApiService {
  /** @private @type {import('axios').AxiosInstance} */
  api;
  
  /** @private @type {string} */
  baseURL = Platform.select({
    android: 'http://10.0.2.2:3000/api',      // Android emülatör
    ios: 'http://192.168.1.101:3000/api',     // iPhone (WiFi)
    default: 'http://192.168.1.101:3000/api'  // Gerçek cihaz
  }) || 'http://192.168.1.101:3000/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Token interceptor
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  // ✅ Register
  async register(userData) {
    try {
      // Düzeltildi: /auth yerine /api/auth
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ✅ Login
  async login(credentials) {
    try {
      const response = await this.api.post('/auth/login', credentials);
      const { data } = response;

      if (data.success && data.data) {
        await AsyncStorage.setItem('authToken', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
      }
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ✅ Profile
  async getProfile() {
    try {
      const response = await this.api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ✅ User details
  async getUserDetails() {
    try {
      const response = await this.api.get('/auth/user-details');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUserDetails(details) {
    try {
      const response = await this.api.put('/auth/user-details', details);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler (değişmedi)
  handleError(error) {
    console.log('API Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
    });
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        'Server error';
      return new Error(`Server Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      return new Error(`Network Error: ${error.message}`);
    } else {
      return new Error(`Error: ${error.message}`);
    }
  }
}

export default new ApiService();
