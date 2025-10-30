import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// NOT: TypeScript tip tanımları (ApiResponse, LoginRequest, vb.)
// JavaScript dosyasında kaldırılarak sadece işlevsellik bırakılmıştır.

class ApiService {
  /** @private @type {import('axios').AxiosInstance} */
  api;
  
  /** @private @type {string} */
  baseURL = Platform.select({
    android: 'http://10.0.2.2:3000/api',   // Android emülatör
    ios: 'http://localhost:3000/api',      // iOS emülatör
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
          // Axios 1.x sonrası headers tipi değişimini desteklemek için esnek kullanım
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
          console.warn('401 Unauthorized: Clearing storage.');
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // Yönlendirme/Logout aksiyonu burada tetiklenebilir
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints

  /**
   * Kullanıcı girişi yapar ve token/kullanıcı verisini depolar.
   * @param {object} credentials - { email: string, password: string }
   * @returns {Promise<object>} API yanıt verisi
   */
  async login(credentials) {
    try {
      const response = await this.api.post('/auth/login', credentials);
      
      const { data } = response;

      if (data.success && data.data) {
        // Store token and user data
        await AsyncStorage.setItem('authToken', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
      }
      
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Yeni kullanıcı kaydı yapar.
   * @param {object} userData - Kayıt için kullanıcı verileri
   * @returns {Promise<object>} API yanıt verisi
   */
  async register(userData) {
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Kullanıcı profilini getirir.
   * @returns {Promise<object>} API yanıt verisi
   */
  async getProfile() {
    try {
      const response = await this.api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Kullanıcıyı uygulamadan çıkarır (Storage temizliği).
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      console.log('Logout successful, storage cleared.');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Health check
  /**
   * API servisinin durumunu kontrol eder.
   * @returns {Promise<object>} API yanıt verisi
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  /**
   * @private
   * Axios hatalarını daha okunabilir bir Hata (Error) nesnesine dönüştürür.
   * @param {import('axios').AxiosError} error - Axios hata nesnesi
   * @returns {Error} Özelleştirilmiş Hata nesnesi
   */
  handleError(error) {
    console.log('API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      request: error.request,
      config: error.config
    });
    
    if (error.response) {
      // Sunucu hatası (4xx, 5xx)
      const message = error.response.data?.error?.message || error.response.data?.message || 'Server error';
      return new Error(`Server Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Ağ hatası (Sunucuya ulaşılamadı)
      return new Error(`Network Error: ${error.message || 'Cannot connect to server'}`);
    } else {
      // Diğer hatalar
      return new Error(`Error: ${error.message || 'An unexpected error occurred'}`);
    }
  }

  // Get stored user data
  /**
   * Depolanmış kullanıcı verisini getirir.
   * @returns {Promise<object | null>} Kullanıcı nesnesi veya null
   */
  async getStoredUser() {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  // Check if user is authenticated
  /**
   * Kullanıcının kimliği doğrulanmış mı kontrol eder.
   * @returns {Promise<boolean>}
   */
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // User details endpoints

  /**
   * Ek kullanıcı detaylarını getirir.
   * @returns {Promise<object>} API yanıt verisi
   */
  async getUserDetails() {
    try {
      const response = await this.api.get('/auth/user-details');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Ek kullanıcı detaylarını günceller.
   * @param {object} details - { height: number, weight: number, injuries: string[] }
   * @returns {Promise<object>} API yanıt verisi
   */
  async updateUserDetails(details) {
    try {
      const response = await this.api.put('/auth/user-details', details);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new ApiService();