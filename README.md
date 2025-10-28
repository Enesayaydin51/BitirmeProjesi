# 🏋️ Gym App - Full Stack Mobile Application

Modern bir gym yönetim uygulaması. React Native (Expo) frontend, Node.js backend ve PostgreSQL veritabanı ile geliştirilmiştir. Takım çalışması için Git ve Docker Compose ile kolay kurulum sunar.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Gereksinimler](#-gereksinimler)
- [Git ile Başlama](#-git-ile-başlama)
- [Docker ile Hızlı Başlangıç](#-docker-ile-hızlı-başlangıç)
- [Frontend (Expo) Geliştirme](#-frontend-expo-geliştirme)
- [Backend (Opsiyonel) Manuel Çalıştırma](#-backend-opsiyonel-manuel-çalıştırma)
- [PgAdmin ve Veritabanı](#-pgadmin-ve-veritabanı)
- [Proje Yapısı](#-proje-yapısı)
- [Sorun Giderme](#-sorun-giderme)
- [Katkıda Bulunma](#-katkıda-bulunma)

## ✨ Özellikler

- 🔐 Kullanıcı kaydı ve girişi
- 📱 React Native mobil uygulama
- 🚀 Node.js REST API
- 🗄️ PostgreSQL veritabanı
- 🐳 Docker containerization
- 🔒 JWT token authentication
- 📊 Clean Architecture (DDD)

## 🛠️ Teknolojiler

### Frontend
- **React Native** - Mobil uygulama framework'ü
- **Expo** - Geliştirme ve deployment platformu
- **TypeScript** - Type-safe JavaScript
- **Axios** - HTTP client
- **AsyncStorage** - Local storage

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - İlişkisel veritabanı
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Swagger** - API dokümantasyonu

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Gereksinimler

### Sistem Gereksinimleri
- **Node.js** (v18+ önerilir)
- **npm** veya **yarn**
- **Docker Desktop** (Windows/Mac/Linux)
- **Git**

### Mobil Geliştirme
- **Expo CLI** (`npm install -g @expo/cli`)
- **Expo Go** uygulaması (Android/iOS)

## 🔧 Git ile Başlama

Takımınızla çalışmak için bu adımları izleyin (ilk kez kurulum yapan kişi için):

```bash
# 1) Yeni bir GitHub reposu oluşturun (boş, README olmadan)

# 2) Yerelde repo başlatın ve ilk commit'i yapın
git init
git add .
git commit -m "chore: initial project import"

# 3) Uzak repo adresini ekleyin ve gönderin
git remote add origin https://github.com/<org-or-username>/<repo-name>.git
git branch -M main
git push -u origin main

# 4) Takım arkadaşları repo'yu klonlar
git clone https://github.com/<org-or-username>/<repo-name>.git
cd <repo-name>
```

Branch akışı önerisi:
- `main`: kararlı sürüm
- `dev`: entegrasyon
- `feature/*`: özellik geliştirme dalları

### 5. Manuel Kurulum (Docker olmadan)

Eğer Docker kullanmak istemiyorsanız:

#### Backend
```bash
cd gym-app-backend
npm install
npm start
```

#### Frontend
```bash
cd gym-app-frontend/GymApp
npm install
npm start
```

#### Veritabanı
```bash
# PostgreSQL'i manuel olarak kurun ve çalıştırın
# Port: 5432, Database: gym_app_db, User: postgres, Password: postgres
```

## 🐳 Docker ile Hızlı Başlangıç

Proje kök dizininde (bu dosyanın bulunduğu yer):

```bash
# Servisleri arka planda başlatın
docker compose up -d

# (İlk kurulumda image build etmek için)
docker compose up -d --build

# Container durumunu görün
docker compose ps

# Belirli bir servisin loglarını takip edin (örn. backend)
docker compose logs -f backend

# Tüm servisleri durdurun ve kaldırın
docker compose down
```

Erişim adresleri:
- **Backend API**: http://localhost:3000
- **PgAdmin**: http://localhost:5050 (kullanıcı: `admin@gymapp.com`, şifre: `admin123`)
- **Frontend (Expo)**: Terminalde çıkan QR kod ile Expo Go'dan açın

## 📱 Kullanım

### Backend API

Backend şu adreslerde çalışır:
- **API Base URL**: `http://localhost:3000/api`
- **Health Check**: `http://localhost:3000/health`
- **Swagger UI**: `http://localhost:3000/api-docs`

## 📱 Frontend (Expo) Geliştirme

```bash
cd gym-app-frontend
npm install
npx expo start
```

API tabanı `gym-app-frontend/src/services/api.ts` içinde ayarlanır. Gerçek cihazda test için bilgisayar IP'nizi kullanın:

```ts
// src/services/api.ts
// Geliştirme için örnek:
const baseURL = "http://YOUR_IP_ADDRESS:3000/api";
```

### API Test

Backend ayakta iken `http://localhost:3000/health` veya mevcut endpointleri kullanarak test edebilirsiniz. (Swagger entegrasyonu eklenirse burada belirtilecektir.)

## 🗄️ PgAdmin ve Veritabanı

PgAdmin ile veritabanını yönetebilirsiniz:
1. `http://localhost:5050` adresini açın
2. Giriş bilgileri: Email: `admin@gymapp.com`, Parola: `admin123`
3. Sol menüden Servers > Register > Server
4. General > Name: `gym-app-db`
5. Connection > Host: `postgres`, Port: `5432`, Username: `postgres`, Password: `postgres`

Not: `Host` alanında `postgres` kullanmamızın sebebi, Docker Compose ağında veritabanı servisi adının `postgres` olmasıdır.

## 🔐 Örnek Auth İstekleri

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

## 🏗️ Proje Yapısı

```
gymAp/
├── gym-app-backend/           # Backend API
│   ├── src/
│   │   ├── application/       # Use cases & DTOs
│   │   ├── domain/            # Entities & Repositories
│   │   ├── infrastructure/    # Database & External services
│   │   └── presentation/      # Controllers & Routes
│   ├── gym-app-database/      # SQL init ve migration dosyaları
│   ├── docker-compose.yml     # Backend tarafı compose (opsiyonel)
│   └── package.json
├── gym-app-frontend/          # Mobile App (Expo)
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/
│   │   └── types/
│   ├── app.json
│   └── package.json
├── docker-compose.yml         # Kökten tüm servisleri başlatır
└── README.md
```

## 🔧 Sorun Giderme

### Backend Sorunları

#### Veritabanı Bağlantı Hatası
```bash
# Docker container'ları kontrol edin
docker compose ps

# Veritabanını yeniden başlatın
docker compose down
docker compose up -d
```

#### Port Zaten Kullanımda
```bash
# 3000 portunu kullanan process'i bulun
netstat -ano | findstr :3000

# Process'i sonlandırın
taskkill /PID <process_id> /F
```

### Frontend Sorunları

#### Metro Bundler Hatası
```bash
# Cache'i temizleyin
npx expo start --clear

# node_modules'ı yeniden yükleyin
rm -rf node_modules
npm install
```

#### Network Bağlantı Hatası
- Backend'in çalıştığından emin olun
- API URL'inin doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin

### Docker Sorunları

#### Docker Desktop Çalışmıyor
- Docker Desktop'ı yeniden başlatın
- Windows'ta WSL2'nin etkin olduğundan emin olun

#### Container Başlamıyor
```bash
# Log'ları kontrol edin
docker compose logs

# Container'ları yeniden oluşturun
docker compose up --build -d
```

## 🌐 Network Konfigürasyonu

### Gerçek Cihaz İçin

1. **Bilgisayarınızın IP adresini öğrenin:**
```bash
ipconfig
```

2. **API URL'ini güncelleyin:**
```typescript
// src/services/api.ts
const baseURL = 'http://YOUR_IP:3000/api';
```

3. **Cihaz ve bilgisayarın aynı Wi-Fi ağında olduğundan emin olun**

### Emülatör İçin

```typescript
// Android Emulator için
const baseURL = 'http://10.0.2.2:3000/api';
```

## 🚀 Production Deployment

### Backend Deployment (Özet)

1. Environment değişkenlerini ayarlayın (DB bilgileri ve JWT)
2. Docker image oluşturun ve bir registry'e push edip orkestrasyon ortamında çalıştırın.

### Frontend Deployment (Özet)

1. Expo EAS ile build alın (`eas build -p android/ios`)
2. Mağazalara yükleyin veya dağıtın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Geliştirici**: Takımınız
- **Email**: 
- **GitHub**: 

---

## 🎯 Gelecek Özellikler

- [ ] Gym salonu yönetimi
- [ ] Antrenman takibi
- [ ] Üyelik yönetimi
- [ ] Push notifications
- [ ] Offline mode
- [ ] Social features

---

**Not**: Bu proje eğitim amaçlı geliştirilmiştir. Production kullanımı için ek güvenlik önlemleri alınması önerilir.