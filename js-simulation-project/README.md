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
