// test-ai.js
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  console.log("1. API Key kontrol ediliyor...");
  
  // Önce .env'den oku, yoksa docker-compose'daki key'i kullan
  let apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    // Docker compose'daki API key (test için)
    apiKey = "AIzaSyA_KHiIHkELMEMSEViD4f5uIoRSGyE5MeI";
    console.log("   ⚠️  .env dosyasında GEMINI_API_KEY yok, docker-compose key'i kullanılıyor...");
  }
  
  if (!apiKey) {
    console.error("❌ HATA: API Key bulunamadı!");
    return;
  }
  
  console.log("   ✅ API Key mevcut: ", apiKey.substring(0, 10) + "...");

  console.log("2. SDK başlatılıyor...");
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // ListModels API'sini kullanarak mevcut modelleri kontrol et
  console.log("2.1. Mevcut modelleri listeleniyor (v1 API)...");
  try {
    // Node.js 18+ fetch kullan (yerleşik)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      console.log(`   ✅ ${data.models.length} model bulundu:`);
      data.models.slice(0, 5).forEach(model => {
        console.log(`      - ${model.name}`);
      });
      
      // İlk çalışan modeli bul
      const availableModels = data.models
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .map(m => m.name.replace('models/', ''));
      
      if (availableModels.length > 0) {
        console.log(`\n   Çalışan modeller: ${availableModels.slice(0, 3).join(', ')}`);
        
        // Bu modelleri test et
        for (const modelName of availableModels.slice(0, 3)) {
          try {
            console.log(`\n3. Model deneniyor: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Merhaba, nasılsın?");
            const response = await result.response;
            console.log(`✅ BAŞARILI! Model: ${modelName}`);
            console.log(`   Cevap: ${response.text().substring(0, 100)}...`);
            return; // Başarılı oldu, çık
          } catch (error) {
            console.log(`   ❌ ${modelName} başarısız: ${error.status || 'N/A'} - ${error.message.substring(0, 80)}`);
          }
        }
      } else {
        console.log("   ⚠️  generateContent destekleyen model bulunamadı");
      }
    } else {
      console.log("   ⚠️  Model listesi alınamadı");
      if (data.error) {
        console.log(`   Hata: ${JSON.stringify(data.error)}`);
      }
    }
  } catch (error) {
    console.log(`   ⚠️  ListModels hatası: ${error.message}`);
  }
  
  console.log("\n   Varsayılan modeller deneniyor...");
  // Fallback: Varsayılan modelleri dene
  const modelsToTest = [
    'gemini-pro',           // En eski ve en kararlı
    'gemini-1.0-pro',       // Alternatif
    'gemini-1.5-pro',       // Daha yeni
    'gemini-1.5-flash'      // En son
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`\n3. Model deneniyor: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Merhaba, nasılsın?");
      const response = await result.response;
      console.log(`✅ BAŞARILI! Model: ${modelName}`);
      console.log(`   Cevap: ${response.text().substring(0, 100)}...`);
      return; // Başarılı oldu, çık
    } catch (error) {
      console.log(`   ❌ ${modelName} başarısız: ${error.status || 'N/A'} - ${error.message.substring(0, 80)}`);
      if (modelName === modelsToTest[modelsToTest.length - 1]) {
        // Son model de başarısız oldu
        console.error("\n❌ TÜM MODELLER BAŞARISIZ!");
        console.error("   Son hata detayı:", error);
      }
    }
  }
}

test();

