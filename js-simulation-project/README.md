# JavaScript Ekosistem Simülasyonu

Basit bir ekosistem simülasyonu projesidir. Farklı hayvan türleri arasında avcı-av ilişkileri, çiftleşme ve popülasyon dinamiklerini simüle eder.

## Özellikler

- **Hayvan Türleri**: Koyun, İnek, Tavuk, Horoz, Kurt, Aslan
- **Avcı**: İnsan avcısı
- **Dinamikler**: Avcılık, çiftleşme, enerji sistemi, popülasyon kontrolü

## Kurulum ve Çalıştırma

```bash
npm start

node src/simulation-all-in-one.js
```

## Simülasyon Parametreleri

- **Başlangıç Popülasyonu**: 78 hayvan + 1 avcı
- **Simülasyon Süresi**: 1000 adım
- **Hareket Mesafeleri**: Tür bazında farklı
- **Avcılık Menzilleri**: Kurt (4), Aslan (5), Avcı (8)
- **Çiftleşme Mesafesi**: 3 birim

## Çıktı

Simülasyon sonunda aşağıdaki istatistikler gösterilir:
- Başlangıç ve son popülasyon sayıları
- Avcılık başarı oranları
- Çiftleşme istatistikleri
- Yaşam süreleri ve enerji bilgileri
- Tür bazında detaylar
