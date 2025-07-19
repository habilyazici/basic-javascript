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
- Enerji minimum 10 olmalı
- %15 çiftleşme şansı (kontrollü büyüme)
- Tavuk-Horoz çiftleşmesi özel: %70 tavuk, %30 horoz doğar

### ⚡ Enerji ve Hareket
- Her hayvan 100 enerji ile başlar
- Hareket halinde %10 ihtimalle enerji azalır (1/adım)
- Enerji 0 olunca hayvan ölür
- Her türün farklı hareket mesafesi var

### 🦠 Afet/Hastalık Sistemi
- Popülasyon 100'ü geçerse hastalık başlar
- %20 oranında rastgele ölüm
- Ekosistemi dengede tutar

## 🚀 Kurulum ve Çalıştırma

```bash
# Proje klasörüne git
cd js-simulation-project

# Simülasyonu çalıştır
node src/simulation-all-in-one.js
```

## 🔧 Dosya Yapısı

```
js-simulation-project/
├── src/
│   └── simulation-all-in-one.js    # Ana simülasyon kodu
├── package.json                    # NPM konfigürasyonu
└── README.md                       # Bu dosya
```

## 📊 İstatistikler

Simülasyon şu istatistikleri takip eder:
- **bornCount**: Doğan hayvan sayısı
- **hunterKillCount**: Avcının öldürdüğü hayvan sayısı
- **lionKillCount**: Aslanların öldürdüğü hayvan sayısı
- **wolfKillCount**: Kurtların öldürdüğü hayvan sayısı

## 🎮 Simülasyon Parametreleri

### Hareket Mesafeleri
- Koyun/İnek: 2 birim
- Tavuk/Horoz: 1 birim  
- Kurt: 3 birim
- Aslan: 4 birim
- Avcı: 1 birim

### Avlama Mesafeleri
- Kurt: 4 birim
- Aslan: 5 birim
- Avcı: 8 birim (görüş mesafesi)

### Başlangıç Popülasyonu
- 30 Koyun (15 erkek, 15 dişi)
- 10 İnek (5 erkek, 5 dişi)
- 10 Tavuk (dişi)
- 10 Horoz (erkek)
- 10 Kurt (5 erkek, 5 dişi)
- 8 Aslan (4 erkek, 4 dişi)
- 1 Avcı
