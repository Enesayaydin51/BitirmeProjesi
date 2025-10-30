import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ApiResponse, LoginRequest, LoginResponse, CreateUserRequest, User } from '../types';

class ApiService {
  private api: AxiosInstance;
  // Platform'a göre dinamik URL seçimi
  private baseURL = Platform.select({
    android: 'http://10.0.2.2:3000/api',  // Android emülatör
    ios: 'http://localhost:3000/api',     // iOS emülatör
    default: 'http://192.168.134.230:3000/api' // Gerçek cihaz (WiFi IP)
  }) || 'http://192.168.134.230:3000/api';

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 saniye timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, clear storage and redirect to login
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // You might want to dispatch a logout action here
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', response.data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/health');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: any): Error {
    console.log('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      request: error.request,
      config: error.config
    });
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error?.message || error.response.data?.message || 'Server error';
      return new Error(`Server Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Network error
      return new Error(`Network Error: ${error.message || 'Cannot connect to server'}`);
    } else {
      // Other error
      return new Error(`Error: ${error.message || 'An unexpected error occurred'}`);
    }
  }

  // Get stored user data
  async getStoredUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // User details endpoints
  async getUserDetails(): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/auth/user-details');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateUserDetails(details: { height: number; weight: number; injuries: string[] }): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await this.api.put('/auth/user-details', details);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}

export default new ApiService();
