# JavaScript Ekosistem Simülasyonu 🦁🐺🐑

Bu proje, hayvanların yaşam döngüsünü, avlanmayı, çiftleşmeyi ve popülasyon dinamiklerini simüle eden kapsamlı bir JavaScript uygulamasıdır.

## 📋 Özellikler

### 🐾 Hayvan Türleri
- **Koyun** (Sheep) - Otçul, kolay av
- **İnek** (Cow) - Otçul, yavaş hareket
- **Tavuk** (Chicken) - Omnivore, küçük
- **Horoz** (Rooster) - Omnivore, küçük
- **Kurt** (Wolf) - Etçil avcı
- **Aslan** (Lion) - Etçil avcı

### 🎯 Avcı Sistemi
- İnsan avcısı (Hunter) - Tüm hayvanları avlayabilir
- Aslanlar - Koyun ve inek avlar
- Kurtlar - Koyun, tavuk ve horoz avlar

### 💕 Çiftleşme Sistemi
- Aynı tür, farklı cinsiyet gerekli
- 3 birimlik mesafe içinde olmalı
- Enerji minimum 30 olmalı
- %30 çiftleşme şansı (kontrollü büyüme)
- Tavuk-Horoz çiftleşmesi özel: %70 tavuk, %30 horoz doğar

### ⚡ Enerji ve Hareket
- Her hayvan 100 enerji ile başlar
- Hareket halinde enerji azalır (0.5/adım)
- Enerji 0 olunca hayvan ölür
- Her türün farklı hareket mesafesi var

### 🦠 Afet/Hastalık Sistemi
- Popülasyon 200'ü geçerse hastalık başlar
- %25 oranında rastgele ölüm
- Ekosistemi dengede tutar

## 🚀 Kurulum ve Çalıştırma

```bash
# Proje klasörüne git
cd js-simulation-project

# Normal simülasyon (1000 adım)
npm start

# Test modunu çalıştır
npm test

# Debug modunu çalıştır (10 adım detaylı)
npm run debug

# Uzun debug (20 adım)
npm run debug-long
```

## 🔧 Dosya Yapısı

```
js-simulation-project/
├── src/
│   └── simulation-all-in-one.js    # Ana simülasyon kodu
├── test.js                         # Test dosyası
├── debug.js                        # Debug ve analiz araçları
├── package.json                    # NPM konfigürasyonu
└── README.md                       # Bu dosya
```

## 📊 İstatistikler

Simülasyon şu istatistikleri takip eder:
- **bornCount**: Doğan hayvan sayısı
- **hunterKills**: Avcının öldürdüğü hayvan sayısı
- **lionKills**: Aslanların öldürdüğü hayvan sayısı
- **wolfKills**: Kurtların öldürdüğü hayvan sayısı

## 🎮 Simülasyon Parametreleri

### Başlangıç Popülasyonu
- 30 Koyun (15 erkek, 15 dişi)
- 10 İnek (5 erkek, 5 dişi)
- 10 Tavuk (dişi)
- 10 Horoz (erkek)
- 10 Kurt (5 erkek, 5 dişi)
- 8 Aslan (4 erkek, 4 dişi)

### Hareket Mesafeleri
- Tavuk/Horoz: 1 birim
- Koyun/İnek: 2 birim
- Kurt: 3 birim
- Aslan: 4 birim
- Avcı: 1 birim

### Av Mesafeleri
- Kurt: 4 birim
- Aslan: 5 birim
- Avcı: 8 birim (görüş alanı)

## 🧪 Test Fonksiyonları

Test dosyası şu senaryoları kontrol eder:
- Hayvan yaratma
- Avcı yaratma
- Mesafe hesaplama
- Başlangıç popülasyonu
- Hayvan hareketi
- İstatistik sistemi
- Simülasyon çalışması
- Performans testi

## 🐛 Debug Özellikleri

Debug modu şu detayları gösterir:
- Adım adım popülasyon durumu
- Enerji istatistikleri
- Yakın çiftler
- Tehlikede olan hayvanlar
- Avcı pozisyonu
- Detaylı istatistikler

## 🔬 Örnek Kullanım

```javascript
import { 
    initializeAnimals, 
    Hunter, 
    runSimulation, 
    getStats 
} from './src/simulation-all-in-one.js';

// Simülasyon başlat
const animals = initializeAnimals();
const hunter = new Hunter(250, 250);

// 100 adım çalıştır
const result = runSimulation(animals, hunter, 100);

// Sonuçları göster
console.log('Kalan hayvanlar:', result.length);
console.log('İstatistikler:', getStats());
```

## 🎯 Gelecek Geliştirmeler

- Grafik arayüz ekleme
- Daha karmaşık AI davranışları
- Mevsimsel değişiklikler
- Beslenme zinciri genişletme
- Genetik özellikler
- Çevresel faktörler

## 📝 Notlar

- Simülasyon 500x500 birimlik alanda gerçekleşir
- Manhattan mesafe hesaplaması kullanılır
- ES6 modül sistemi kullanılır
- Rastgele hareket ve olaylar
- Dengeli ekosistem için afet sistemi var

## 🐞 Bilinen Sorunlar

- ✅ Tavuk/Horoz çiftleşmesi eksikti → Düzeltildi
- ✅ Çok hızlı popülasyon artışı → Çiftleşme şansı %30'a düşürüldü
- ✅ Afet sistemi çok sert → %25 ölüm oranına düşürüldü
- ✅ Test dosyaları boştu → Kapsamlı testler eklendi
- ✅ Debug araçları yoktu → Detaylı debug sistemi eklendi

---

**Geliştirici:** Simülasyon projesi | **Versiyon:** 1.0.0 | **Dil:** JavaScript (ES6+)
