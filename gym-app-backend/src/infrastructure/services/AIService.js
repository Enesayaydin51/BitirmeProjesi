const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️  GEMINI_API_KEY bulunamadı. AI özellikleri çalışmayacak.');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    // Test sonucu: v1 API'de çalışan modeller (ListModels ile doğrulandı)
    // Öncelik sırası: Hız (Flash) -> Zeka (Pro)
    this.modelNames = [
      'gemini-2.5-flash',  // En hızlı ve ucuz model (TEST EDİLDİ - ÇALIŞIYOR ✅)
      'gemini-2.5-pro',    // Daha karmaşık işler için
      'gemini-2.0-flash',  // Yedek flash model
      'gemini-2.0-flash-001' // Alternatif
    ];
    
    // Çalışan modeli cache'le (performans için)
    this.cachedWorkingModel = null;
    this.cachedModelName = null;
  }

  /**
   * Yardımcı Metod: JSON stringini temizler
   */
  _cleanJsonString(text) {
    let cleaned = text.trim();
    // Markdown code block'larını temizle (```json ... ```)
    if (cleaned.includes('```')) {
      cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');
    }
    return cleaned.trim();
  }

  /**
   * Retry mekanizması ile API çağrısı yapar (optimize edilmiş - sadece network/503 hataları için)
   * @param {Function} apiCall - API çağrısı yapan fonksiyon
   * @param {number} maxRetries - Maksimum deneme sayısı (varsayılan: 2 - daha az retry)
   * @param {number} baseDelay - Başlangıç bekleme süresi (ms)
   */
  async _retryWithBackoff(apiCall, maxRetries = 2, baseDelay = 500) {
    let lastError = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        const isRetryable = this._isRetryableError(error);
        
        // Retry edilebilir değilse veya son denemeyse, hemen fırlat
        if (!isRetryable || attempt === maxRetries - 1) {
          throw error;
        }
        
        // Sadece network/503 hataları için kısa bir bekleme (500ms, 1s)
        const delay = baseDelay * Math.pow(2, attempt);
        // Sessiz retry - kullanıcıya gereksiz log gösterme
        await this._sleep(delay);
      }
    }
    
    throw lastError;
  }

  /**
   * Hatanın retry edilebilir olup olmadığını kontrol eder
   */
  _isRetryableError(error) {
    if (!error) return false;
    
    const errorMessage = error.message || '';
    const errorStatus = error.status || error.response?.status;
    
    // 503 (Service Unavailable), 429 (Rate Limit), 500 (Server Error) retry edilebilir
    if (errorStatus === 503 || errorStatus === 429 || errorStatus === 500) {
      return true;
    }
    
    // Timeout ve network hataları retry edilebilir
    if (errorMessage.includes('timeout') || 
        errorMessage.includes('ECONNRESET') || 
        errorMessage.includes('ETIMEDOUT') ||
        errorMessage.includes('overloaded') ||
        errorMessage.includes('network')) {
      return true;
    }
    
    return false;
  }

  /**
   * Bekleme fonksiyonu
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Kullanıcının beslenme sorusuna AI ile cevap verir
   */
  async answerNutritionQuestion(question, userContext = {}) {
    if (!this.genAI) throw new Error('Gemini API key yapılandırılmamış.');

    const systemPrompt = `Sen bir beslenme uzmanı ve fitness koçusun. Türkçe cevap ver.
    Kullanıcı: Hedef: ${userContext.goal || '-'}, Boy: ${userContext.height || '-'}, Kilo: ${userContext.weight || '-'}, Durum: ${userContext.injuries?.join(', ') || 'Yok'}
    Kurallar: Bilimsel, kişiselleştirilmiş, kısa (max 300 kelime) cevap ver.`;

    // Önce cache'lenmiş çalışan modeli dene
    if (this.cachedWorkingModel && this.cachedModelName) {
      try {
        const result = await this._retryWithBackoff(async () => {
          return await this.cachedWorkingModel.generateContent(`${systemPrompt}\n\nSoru: ${question}`);
        }, 2, 500); // Sadece 2 retry, 500ms delay
        
        return result.response.text();
      } catch (error) {
        // Cache'lenmiş model başarısız oldu, cache'i temizle ve diğer modelleri dene
        console.warn(`⚠️  Cache'lenmiş model (${this.cachedModelName}) başarısız, diğer modeller deneniyor...`);
        this.cachedWorkingModel = null;
        this.cachedModelName = null;
      }
    }

    // Cache yoksa veya başarısız olduysa, modelleri sırayla dene
    let lastError = null;
    for (const modelName of this.modelNames) {
      try {
        const result = await this._retryWithBackoff(async () => {
          const model = this.genAI.getGenerativeModel({ model: modelName });
          return await model.generateContent(`${systemPrompt}\n\nSoru: ${question}`);
        }, 2, 500); // Sadece 2 retry, 500ms delay
        
        // Başarılı modeli cache'le
        this.cachedWorkingModel = this.genAI.getGenerativeModel({ model: modelName });
        this.cachedModelName = modelName;
        console.log(`✅ Model ${modelName} ile yanıt alındı (cache'lendi).`);
        return result.response.text();
      } catch (error) {
        lastError = error;
        // Sadece gerçekten kritik hatalar için log
        if (!this._isRetryableError(error)) {
          console.warn(`⚠️  Model ${modelName} başarısız: ${error.message}`);
        }
        continue;
      }
    }

    this._handleError(lastError);
  }

  /**
   * Kişiselleştirilmiş beslenme planı oluşturur
   */
  async generateNutritionPlan(userContext = {}) {
    if (!this.genAI) throw new Error('Gemini API key yapılandırılmamış.');

    const systemPrompt = `Sen bir diyetisyensin. Aşağıdaki kullanıcı için JSON formatında beslenme planı hazırla.
    Kullanıcı: ${JSON.stringify(userContext)}
    
    Çıktı SADECE şu JSON formatında olmalı, yorum ekleme:
    {
      "dailyCalories": 2000,
      "protein": "150g",
      "carb": "200g",
      "fat": "60g",
      "meals": [{"title": "Kahvaltı", "items": ["Yumurta", "Yulaf"], "calories": 500}],
      "recommendations": "Bol su iç."
    }`;

    // Önce cache'lenmiş çalışan modeli dene
    if (this.cachedWorkingModel && this.cachedModelName) {
      try {
        const result = await this._retryWithBackoff(async () => {
          return await this.cachedWorkingModel.generateContent(systemPrompt);
        }, 2, 500);
        
        const text = this._cleanJsonString(result.response.text());
        return JSON.parse(text);
      } catch (error) {
        // Cache'lenmiş model başarısız oldu, cache'i temizle
        this.cachedWorkingModel = null;
        this.cachedModelName = null;
      }
    }

    let lastError = null;
    for (const modelName of this.modelNames) {
      try {
        const result = await this._retryWithBackoff(async () => {
          const generationConfig = modelName.includes('1.5') ? { responseMimeType: "application/json" } : undefined;
          const model = this.genAI.getGenerativeModel({ 
              model: modelName,
              generationConfig: generationConfig
          });
          return await model.generateContent(systemPrompt);
        }, 2, 500);

        const text = this._cleanJsonString(result.response.text());
        
        // Başarılı modeli cache'le
        const generationConfig = modelName.includes('1.5') ? { responseMimeType: "application/json" } : undefined;
        this.cachedWorkingModel = this.genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: generationConfig
        });
        this.cachedModelName = modelName;
        console.log(`✅ Model ${modelName} ile plan oluşturuldu (cache'lendi).`);
        return JSON.parse(text);
      } catch (error) {
        lastError = error;
        if (!this._isRetryableError(error)) {
          console.warn(`⚠️  Model ${modelName} ile JSON hatası: ${error.message}`);
        }
        continue;
      }
    }

    this._handleError(lastError);
  }

  /**
   * Yemek önerileri getirir
   */
  async suggestFoods(criteria, userContext = {}) {
    if (!this.genAI) throw new Error('Gemini API key yapılandırılmamış.');

    const systemPrompt = `Kullanıcı için yemek önerisi ver. Kriter: ${criteria}.
    Durum: ${userContext.injuries?.join(', ') || 'Yok'}
    
    SADECE şu JSON formatında cevap ver:
    {
      "foods": [{"name": "Yemek", "calories": 100, "protein": 10, "carb": 5, "fat": 2, "description": "Açıklama"}]
    }`;

    // Önce cache'lenmiş çalışan modeli dene
    if (this.cachedWorkingModel && this.cachedModelName) {
      try {
        const result = await this._retryWithBackoff(async () => {
          return await this.cachedWorkingModel.generateContent(systemPrompt);
        }, 2, 500);
        
        const text = this._cleanJsonString(result.response.text());
        const parsed = JSON.parse(text);
        return parsed.foods || [];
      } catch (error) {
        this.cachedWorkingModel = null;
        this.cachedModelName = null;
      }
    }

    let lastError = null;
    for (const modelName of this.modelNames) {
      try {
        const result = await this._retryWithBackoff(async () => {
          const generationConfig = modelName.includes('1.5') ? { responseMimeType: "application/json" } : undefined;
          const model = this.genAI.getGenerativeModel({ 
              model: modelName,
              generationConfig: generationConfig
          });
          return await model.generateContent(systemPrompt);
        }, 2, 500);

        const text = this._cleanJsonString(result.response.text());
        const parsed = JSON.parse(text);
        
        // Başarılı modeli cache'le
        const generationConfig = modelName.includes('1.5') ? { responseMimeType: "application/json" } : undefined;
        this.cachedWorkingModel = this.genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: generationConfig
        });
        this.cachedModelName = modelName;
        console.log(`✅ Model ${modelName} ile öneri alındı (cache'lendi).`);
        return parsed.foods || [];
      } catch (error) {
        lastError = error;
        if (!this._isRetryableError(error)) {
          console.warn(`⚠️  Model ${modelName} başarısız: ${error.message}`);
        }
        continue;
      }
    }

    this._handleError(lastError);
  }

  /**
   * Hata yönetimi yardımcısı
   */
  _handleError(error) {
    console.error('Gemini API Kritik Hata:', error);
    
    if (error && (error.status === 429 || error.message?.includes('429'))) {
      throw new Error('Servis şu an çok yoğun, lütfen biraz bekleyip tekrar deneyin (Kota Aşıldı).');
    }
    if (error && (error.status === 503 || error.message?.includes('503') || error.message?.includes('overloaded'))) {
      throw new Error('AI servisi şu an aşırı yüklü. Lütfen birkaç saniye bekleyip tekrar deneyin.');
    }
    if (error && (error.status === 401 || error.status === 403)) {
      throw new Error('API Anahtarı hatası.');
    }
    if (error && (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT'))) {
      throw new Error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
    }
    if (error && (error.message?.includes('network') || error.message?.includes('ECONNRESET'))) {
      throw new Error('Ağ bağlantı hatası. İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
    }
    throw new Error('AI servisi şu an yanıt veremiyor. Lütfen daha sonra tekrar deneyin.');
  }
}

module.exports = AIService;