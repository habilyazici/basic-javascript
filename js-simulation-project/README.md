1. JavaScript Ekosistem Simülasyonu

**Repository**: https://github.com/habilyazici/basic-javascript/tree/main/js-simulation-project

1.1 Teknik Genel Bakış
- **Dil**: Pure JavaScript (ES6+)
- **Paradigma**: Object-Oriented Programming
- **Algoritma**: Rastgele hareket, mesafe hesaplama, olasılık tabanlı etkileşimler
- **Veri Yapıları**: Array-based entity management
- **Performans**: O(n²) kompleksiteli çarpışma algılama

1.2 Simülasyon Motorunun Çalışma Prensibi
- Her frame'de tüm varlıklar (entities) güncellenir
- Mesafe hesaplamaları Euclidean distance formülü ile yapılır
- Rastgele sayı üretimi için Math.random() kullanılır
- State management basit property-based yaklaşım ile gerçekleştirilir

2. Varlık Sistemleri ve Algoritmalar

2.1 Hayvan Sınıf Hiyerarşisi
```
Animal (Base Class)
├── Herbivore
│   ├── Sheep (movement: 2, energy: 100)
│   └── Cow (movement: 2, energy: 100)
├── Omnivore
│   ├── Chicken (movement: 1, energy: 100, gender: female)
│   └── Rooster (movement: 1, energy: 100, gender: male)
└── Carnivore
    ├── Wolf (movement: 3, huntRange: 4, energy: 100)
    └── Lion (movement: 4, huntRange: 5, energy: 100)
```

2.2 Avcı-Av İlişki Matrisi
```
Predator    | Target Species           | Hunt Range | Success Rate
-----------|--------------------------|------------|-------------
Hunter     | All species              | 8 units    | 100%
Lion       | Sheep, Cow              | 5 units    | 100%
Wolf       | Sheep, Chicken, Rooster | 4 units    | 100%
```

2.3 Çiftleşme Algoritması
```javascript
// Pseudo-code
function attemptMating(animal1, animal2) {
    if (animal1.species === animal2.species &&
        animal1.gender !== animal2.gender &&
        distance(animal1, animal2) <= 3 &&
        animal1.energy >= 10 && animal2.energy >= 10 &&
        Math.random() < 0.15) {
        return createOffspring(animal1.species);
    }
    return null;
}
```

2.4 Enerji Yönetim Sistemi
- **Başlangıç Değeri**: 100 units
- **Hareket Maliyeti**: 10% probability per move → -1 energy
- **Minimum Yaşam Eşiği**: 0 (death condition)
- **Çiftleşme Eşiği**: 10 units minimum
- **Enerji Azalma Formülü**: `if (Math.random() < 0.1) energy--`

2.5 Popülasyon Kontrol Mekanizması
```javascript
// Disease outbreak algorithm
if (totalPopulation > 100) {
    animals.forEach(animal => {
        if (Math.random() < 0.2) {
            animal.die();
        }
    });
}
```

3. Kurulum ve Çalıştırma

3.1 Sistem Gereksinimleri
- **Node.js**: v12.0.0 veya üzeri
- **İşletim Sistemi**: Windows, macOS, Linux
- **RAM**: Minimum 512MB (önerilen: 1GB+)
- **CPU**: Single-core yeterli

3.2 Kurulum Adımları
```bash
# Repository'yi klonlayın
git clone https://github.com/habilyazici/basic-javascript.git

# Proje dizinine gidin
cd basic-javascript/js-simulation-project

# Bağımlılıkları yükleyin (varsa)
npm install

# Simülasyonu başlatın
node src/simulation-all-in-one.js
```

3.3 Çalışma Zamanı Parametreleri
- **Frame Rate**: Sınırsız (CPU'ya bağlı)
- **Çıkış Koşulu**: Manuel durdurma (Ctrl+C)
- **Log Level**: Console output (animals count, statistics)

4. Proje Mimarisi ve Dosya Yapısı

```
js-simulation-project/
├── src/
│   └── simulation-all-in-one.js    # Main simulation engine (monolithic)
├── package.json                    # NPM configuration & metadata
└── README.md                       # Technical documentation
```

4.1 Kod Organizasyonu
```javascript
// simulation-all-in-one.js structure
├── Class Definitions
│   ├── Animal (abstract base class)
│   ├── Sheep, Cow, Chicken, Rooster, Wolf, Lion
│   └── Hunter (special entity)
├── Utility Functions
│   ├── distance() - Euclidean distance calculation
│   ├── createAnimal() - Factory pattern implementation
│   └── displayStats() - Console output formatting
└── Main Loop
    ├── Movement phase
    ├── Hunting phase
    ├── Mating phase
    ├── Energy management
    └── Population control
```

4.2 Bellek Kullanımı
- **Animal Instance**: ~200 bytes (x, y, energy, gender, species)
- **Total Memory**: ~20KB (100 animals × 200 bytes)
- **Garbage Collection**: Automatic (dead animals removed from array)

5. Simülasyon Parametreleri ve Konfigürasyon

5.1 İlk Popülasyon Matrisi
```
Species  | Male | Female | Total | Gender Ratio
---------|------|--------|-------|-------------
Sheep    | 15   | 15     | 30    | 1:1
Cow      | 5    | 5      | 10    | 1:1
Chicken  | 0    | 10     | 10    | 0:1
Rooster  | 10   | 0      | 10    | 1:0
Wolf     | 5    | 5      | 10    | 1:1
Lion     | 4    | 4      | 8     | 1:1
Hunter   | 1    | 0      | 1     | N/A
---------|------|--------|-------|-------------
TOTAL    | 40   | 39     | 79    | 1.03:1
```

5.2 Hareket Algoritması Parametreleri
```javascript
// Movement distance per species per frame
const MOVEMENT_CONFIG = {
    sheep: { min: 1, max: 2, algorithm: 'random_walk' },
    cow: { min: 1, max: 2, algorithm: 'random_walk' },
    chicken: { min: 1, max: 1, algorithm: 'random_walk' },
    rooster: { min: 1, max: 1, algorithm: 'random_walk' },
    wolf: { min: 1, max: 3, algorithm: 'predator_seek' },
    lion: { min: 1, max: 4, algorithm: 'predator_seek' },
    hunter: { min: 1, max: 1, algorithm: 'random_patrol' }
};
```

5.3 Avlanma Mesafe Konfigürasyonu
```javascript
const HUNT_RANGES = {
    wolf: 4.0,    // Units (Euclidean distance)
    lion: 5.0,    // Units (Euclidean distance) 
    hunter: 8.0   // Units (sight range)
};
```

6. Performans Metrikleri ve İstatistikler

6.1 Çalışma Zamanı Kompleksitesi
- **Ana Döngü**: O(n) - n = toplam hayvan sayısı
- **Mesafe Hesaplama**: O(n²) - tüm çiftler arası mesafe
- **Avlanma Kontrolü**: O(p×h) - p = avcı sayısı, h = av sayısı
- **Çiftleşme Kontrolü**: O(n²) - tüm çiftler arası kontrol

6.2 İstatistik Takibi
```javascript
const statistics = {
    bornCount: 0,           // Total births
    hunterKillCount: 0,     // Hunter kills
    lionKillCount: 0,       // Lion kills  
    wolfKillCount: 0,       // Wolf kills
    diseaseDeathCount: 0,   // Disease deaths
    energyDeathCount: 0,    // Energy depletion deaths
    frameCount: 0,          // Simulation frames
    averageFPS: 0           // Performance metric
};
```
