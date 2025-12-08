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
    ios: 'http://localhost:3000/api',       // iOS emülatör
    web: 'http://localhost:3000/api',       // Web platform
    default: 'http://localhost:3000/api'    // Varsayılan (Docker için localhost)
  }) || 'http://localhost:3000/api';

  constructor() {
    console.log('API Service initialized with baseURL:', this.baseURL);
    console.log('Platform:', Platform.OS);
    
    // Gerçek cihazda kullanılıyorsa uyarı ver
    if (Platform.OS !== 'web' && this.baseURL.includes('localhost')) {
      console.warn('⚠️  UYARI: Gerçek cihazda localhost çalışmaz!');
      console.warn('⚠️  Bilgisayarınızın IP adresini kullanın: http://YOUR_IP:3000/api');
      console.warn('⚠️  IP adresinizi öğrenmek için: ipconfig (Windows) veya ifconfig (Mac/Linux)');
    }
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // 60 saniye timeout (AI istekleri için daha uzun)
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Axios instance oluşturuldu - Timeout:', this.api.defaults.timeout, 'ms');

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        console.log('=== REQUEST INTERCEPTOR ===');
        console.log('Request URL:', config.url);
        console.log('Request method:', config.method);
        console.log('Request baseURL:', config.baseURL);
        console.log('Full URL:', `${config.baseURL}${config.url}`);
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          console.log('Token bulundu, header\'a ekleniyor');
          // Axios 1.x sonrası headers tipi değişimini desteklemek için esnek kullanım
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.log('Token bulunamadı');
        }
        console.log('Request config:', config);
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        console.log('=== RESPONSE INTERCEPTOR (SUCCESS) ===');
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        return response;
      },
      async (error) => {
        console.error('=== RESPONSE INTERCEPTOR (ERROR) ===');
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        console.error('Error message:', error.message);
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
      console.log('=== LOGIN API FONKSİYONU BAŞLADI ===');
      console.log('BaseURL:', this.baseURL);
      console.log('Full URL:', `${this.baseURL}/auth/login`);
      console.log('Credentials:', { ...credentials, password: '***' });
      console.log('Axios instance:', this.api);
      console.log('POST çağrısı yapılıyor...');
      
      const response = await this.api.post('/auth/login', credentials);
      
      console.log('=== POST ÇAĞRISI TAMAMLANDI ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      const { data } = response;

      if (data.success && data.data) {
        console.log('Token kaydediliyor...');
        // Store token and user data
        await AsyncStorage.setItem('authToken', data.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('Token ve kullanıcı bilgileri kaydedildi');
      }
      
      return data;
    } catch (error) {
      console.error('=== LOGIN API HATASI ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      console.error('Error config:', error.config);
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
      // Health check endpoint'i /api prefix'i olmadan tanımlı
      const response = await axios.get(this.baseURL.replace('/api', '') + '/health');
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
      config: error.config,
      baseURL: this.baseURL
    });
    
    if (error.response) {
      // Sunucu hatası (4xx, 5xx)
      const message = error.response.data?.error?.message || error.response.data?.message || 'Server error';
      return new Error(`Server Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      // Ağ hatası (Sunucuya ulaşılamadı)
      const url = error.config?.url ? `${this.baseURL}${error.config.url}` : this.baseURL;
      return new Error(`Network Error: Backend'e ulaşılamıyor. URL: ${url}. Backend'in çalıştığından emin olun.`);
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
      console.log('API updateUserDetails called with:', details);
      const response = await this.api.put('/auth/user-details', details);
      console.log('API updateUserDetails response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API updateUserDetails error:', error);
      throw this.handleError(error);
    }
  }

  // AI endpoints

  /**
   * AI ile beslenme sorusu sorar.
   * @param {string} question - Kullanıcının sorusu
   * @returns {Promise<object>} AI cevabı
   */
  async askNutritionQuestion(question) {
    try {
      console.log('AI soru gönderiliyor:', question);
      console.log('API BaseURL:', this.baseURL);
      console.log('Full URL:', `${this.baseURL}/ai/nutrition-question`);
      console.log('Timeout ayarı:', this.api.defaults.timeout, 'ms');
      
      // Timeout'u manuel olarak kontrol et ve ayarla
      const config = {
        timeout: 60000 // 60 saniye - AI istekleri için
      };
      
      const response = await this.api.post('/ai/nutrition-question', { question }, config);
      console.log('AI cevap alındı:', response.data);
      return response.data;
    } catch (error) {
      console.error('AI soru hatası detayları:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request,
        baseURL: this.baseURL,
        timeout: this.api.defaults.timeout
      });
      throw this.handleError(error);
    }
  }

  /**
   * AI ile kişiselleştirilmiş beslenme planı oluşturur.
   * @returns {Promise<object>} Beslenme planı
   */
  async generateAIPlan() {
    try {
      console.log('AI plan oluşturuluyor...');
      console.log('Timeout ayarı:', this.api.defaults.timeout, 'ms');
      
      // Timeout'u manuel olarak kontrol et ve ayarla
      const config = {
        timeout: 60000 // 60 saniye - AI istekleri için
      };
      
      const response = await this.api.post('/ai/nutrition-plan', {}, config);
      console.log('AI plan alındı:', response.data);
      return response.data;
    } catch (error) {
      console.error('AI plan hatası detayları:', {
        message: error.message,
        code: error.code,
        timeout: this.api.defaults.timeout
      });
      throw this.handleError(error);
    }
  }

  /**
   * AI ile yemek önerileri alır.
   * @param {string} criteria - Öneri kriterleri
   * @returns {Promise<object>} Yemek önerileri
   */
  async getAIFoodSuggestions(criteria) {
    try {
      const response = await this.api.post('/ai/food-suggestions', { criteria });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default new ApiService();