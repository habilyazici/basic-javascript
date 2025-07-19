
export const ANIMAL_TYPES = {
    SHEEP: 'sheep',
    COW: 'cow',
    CHICKEN: 'chicken',
    ROOSTER: 'rooster',
    WOLF: 'wolf',
    LION: 'lion'
};

export const HUNTER_TYPE = 'hunter';


export const HUNTING_DISTANCES = {
    [ANIMAL_TYPES.WOLF]: 4,
    [ANIMAL_TYPES.LION]: 5
};

export const MATING_DISTANCE = 3;

export const MOVEMENT_DISTANCES = {
    [ANIMAL_TYPES.SHEEP]: 2,
    [ANIMAL_TYPES.COW]: 2,
    [ANIMAL_TYPES.CHICKEN]: 1,
    [ANIMAL_TYPES.ROOSTER]: 1,
    [ANIMAL_TYPES.WOLF]: 3,
    [ANIMAL_TYPES.LION]: 4,
    [HUNTER_TYPE]: 1
};

export function getRandomPosition() {
    return Math.floor(Math.random() * 500);
}

export function getRandomGender() {
    return Math.random() < 0.5 ? 'male' : 'female';
}

export function calculateDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export class Animal {
    constructor(type, gender, x, y) {
        this.type = type;
        this.gender = gender;
        this.x = x;
        this.y = y;
        this.energy = 100;
        this.alive = true;
    }

    move(hunter, animals) {
        const movementDistance = MOVEMENT_DISTANCES[this.type];
        
        const dx = [0, 1, 0, -1];
        const dy = [1, 0, -1, 0];
        
        const direction = Math.floor(Math.random() * 4);
        
        this.x = Math.max(0, Math.min(499, this.x + dx[direction] * movementDistance));
        this.y = Math.max(0, Math.min(499, this.y + dy[direction] * movementDistance));
        
        if (Math.random() < 0.1) {
            this.energy = Math.max(0, this.energy - 1);
        }
        
        if (this.energy === 0) this.alive = false;
    }
}

export class Hunter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visionRange = 8;
    }

    move() {
        const dx = [0, 1, 0, -1];
        const dy = [1, 0, -1, 0];
        const direction = Math.floor(Math.random() * 4);
        
        this.x = Math.max(0, Math.min(499, this.x + dx[direction] * MOVEMENT_DISTANCES[HUNTER_TYPE]));
        this.y = Math.max(0, Math.min(499, this.y + dy[direction] * MOVEMENT_DISTANCES[HUNTER_TYPE]));
    }
}

let bornCount = 0;
let hunterKillCount = 0;
let lionKillCount = 0;
let wolfKillCount = 0;

export function getStats() {
    return { 
        bornCount,
        hunterKillCount,
        lionKillCount,
        wolfKillCount
    };
}

export function resetStats() {
    bornCount = 0;
    hunterKillCount = 0;
    lionKillCount = 0;
    wolfKillCount = 0;
}

export function initializeAnimals() {
    const animals = [];
    
    for (let i = 0; i < 15; i++) {
        animals.push(new Animal(ANIMAL_TYPES.SHEEP, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.SHEEP, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    for (let i = 0; i < 5; i++) {
        animals.push(new Animal(ANIMAL_TYPES.COW, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.COW, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    for (let i = 0; i < 10; i++) {
        animals.push(new Animal(ANIMAL_TYPES.CHICKEN, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    for (let i = 0; i < 10; i++) {
        animals.push(new Animal(ANIMAL_TYPES.ROOSTER, 'male', getRandomPosition(), getRandomPosition()));
    }
    
    for (let i = 0; i < 5; i++) {
        animals.push(new Animal(ANIMAL_TYPES.WOLF, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.WOLF, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    for (let i = 0; i < 4; i++) {
        animals.push(new Animal(ANIMAL_TYPES.LION, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.LION, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    return animals;
}

export function applyDisasterIfNeeded(animals) {
    const typeCounts = {};
    
    animals.forEach(animal => {
        if (!typeCounts[animal.type]) typeCounts[animal.type] = 0;
        
        if (animal.alive) typeCounts[animal.type]++;
    });
    
    Object.entries(typeCounts).forEach(([type, count]) => {
        if (count > 100) {
            console.log(`⚠️ DISASTER/DISEASE: ${type} population at critical level (${count}), 20% got sick!`);
            
            let killedCount = 0;
            const killTarget = Math.floor(count * 0.2);
            
            animals.forEach(animal => {
                if (animal.type === type && animal.alive && killedCount < killTarget && Math.random() < 0.25) {
                    animal.alive = false;
                    killedCount++;
                }
            });
            
            console.log(`💀 ${killedCount} ${type} got sick and died.`);
        }
    });
}

export function huntAndMate(animals, hunter) {
    let newAnimals = [];
    let huntedIndices = new Set();
    
    let shortestDistance = hunter.visionRange + 1;
    let closestIndex = -1;
    
    animals.forEach((animal, i) => {
        if (!animal.alive) return;
        
        const distance = calculateDistance(hunter, animal);
        
        if (distance <= hunter.visionRange && distance < shortestDistance) {
            shortestDistance = distance;
            closestIndex = i;
        }
    });
    
    if (closestIndex !== -1 && Math.random() < 0.3) {
        animals[closestIndex].alive = false;
        huntedIndices.add(closestIndex);
        hunterKillCount++;
    }
    
    animals.forEach((animal, i) => {
        if (!animal.alive) return;
        
        if (animal.type === ANIMAL_TYPES.LION) {
            animals.forEach((prey, j) => {
                if (!prey.alive || i === j || huntedIndices.has(j)) return;
                
                if ((prey.type === ANIMAL_TYPES.SHEEP || prey.type === ANIMAL_TYPES.COW) && 
                    calculateDistance(animal, prey) <= HUNTING_DISTANCES[ANIMAL_TYPES.LION]) {
                    
                    if (Math.random() < 0.5) {
                        prey.alive = false;
                        huntedIndices.add(j);
                        animal.energy += 5;
                        lionKillCount++;
                    }
                }
            });
        }
    });
    
    // ========== WOLF HUNTING ==========
    // Wolves hunt sheep, chickens and roosters (different prey types than lions)
    animals.forEach((animal, i) => {
        if (!animal.alive) return;
        
        // Is this animal a wolf?
        if (animal.type === ANIMAL_TYPES.WOLF) {
            animals.forEach((prey, j) => {
                if (!prey.alive || i === j || huntedIndices.has(j)) return;
                
                // Wolves hunt sheep, chickens and roosters (different from lions)
                if ((prey.type === ANIMAL_TYPES.SHEEP || 
                     prey.type === ANIMAL_TYPES.CHICKEN || 
                     prey.type === ANIMAL_TYPES.ROOSTER) && 
                    calculateDistance(animal, prey) <= HUNTING_DISTANCES[ANIMAL_TYPES.WOLF]) {
                    
                    // Hunt with 50% chance
                    if (Math.random() < 0.5) {
                        prey.alive = false;
                        huntedIndices.add(j);
                        animal.energy += 5;  // Hunting wolf gains energy
                        wolfKillCount++;
                    }
                }
            });
        }
    });

    
    
    // ========== MATING SYSTEM ==========
    // Animal mating processes - producing new animals
    
    // Track mated animals (an animal can only mate once)
    let matedIndices = new Set(); // Set = No duplicates list
    
    // Nested for loops - check every animal pair
    // Outer loop: First animal
    for (let i = 0; i < animals.length; i++) {
        // Skip invalid situations:
        // - Skip if dead
        // - Skip if already mated  
        // - Skip if hunted
        if (!animals[i].alive || matedIndices.has(i) || huntedIndices.has(i)) continue;
        
        // Energy check - low energy animals can't mate
        // continue = skip this loop iteration, go to next
        if (animals[i].energy < 10) continue;
        
        // Inner loop: Search for second animal (j = i + 1 because we don't want to check same pairs again)
        for (let j = i + 1; j < animals.length; j++) {
            // Same checks for second animal
            if (!animals[j].alive || matedIndices.has(j) || huntedIndices.has(j)) continue;
            if (animals[j].energy < 10) continue; // Energy check
            
            // Mating conditions (all must be true simultaneously):
            // 1. Same type (sheep-sheep, lion-lion etc.)
            // 2. Different gender (male-female)
            // 3. Close enough
            // !== = Not equal comparison
            if (animals[i].type === animals[j].type &&
                animals[i].gender !== animals[j].gender &&
                calculateDistance(animals[i], animals[j]) <= MATING_DISTANCE) {
                
                // Mating chance 15% (for balanced reproduction)
                // > 0.15 = 85% chance no mating (15% chance mating)
                if (Math.random() > 0.15) continue; // Unlucky, try next animal
                
                // Mating for normal animals (sheep, cow, wolf, lion)
                // includes() = Check if this value exists in Array
                if ([ANIMAL_TYPES.SHEEP, ANIMAL_TYPES.COW, ANIMAL_TYPES.WOLF, ANIMAL_TYPES.LION].includes(animals[i].type)) {
                    // New animal is born in the middle of two parents
                    // Math.round() = Round to nearest integer
                    const newX = Math.round((animals[i].x + animals[j].x) / 2);
                    const newY = Math.round((animals[i].y + animals[j].y) / 2);
                    
                    // Create new animal and add to list
                    newAnimals.push(new Animal(
                        animals[i].type,         // Same type as parent
                        getRandomGender(),       // Random gender
                        newX,                    // Calculated X position
                        newY                     // Calculated Y position
                    ));
                    
                    bornCount++;                    // Increment statistics
                    matedIndices.add(i);            // This animal mated
                    matedIndices.add(j);            // This animal also mated
                    
                    // Mated animals lose energy (tiring process)
                    animals[i].energy -= 3;
                    animals[j].energy -= 3;
                    break; // This animal mated, look for another (exit inner loop)
                    
                } else if (animals[i].type === ANIMAL_TYPES.CHICKEN || animals[i].type === ANIMAL_TYPES.ROOSTER) {
                    // Chicken-Rooster mating special case (different types can mate)
                    const newX = Math.round((animals[i].x + animals[j].x) / 2);
                    const newY = Math.round((animals[i].y + animals[j].y) / 2);
                    
                    // 70% chicken, 30% rooster birth probability
                    // ? : = Conditional operator (ternary)
                    const newType = Math.random() < 0.7 ? ANIMAL_TYPES.CHICKEN : ANIMAL_TYPES.ROOSTER;
                    const newGender = newType === ANIMAL_TYPES.CHICKEN ? 'female' : 'male';
                    
                    newAnimals.push(new Animal(newType, newGender, newX, newY));
                    
                    bornCount++;
                    matedIndices.add(i);
                    matedIndices.add(j);
                    
                    // Mated animals lose energy
                    animals[i].energy -= 3;
                    animals[j].energy -= 3;
                    break; // This animal mated, look for another
                }
            }
        }
    }

    // ========== APPLY RESULTS ==========
    // Remove hunted and dead animals, add newborns
    
    // filter() = Filters elements from Array that meet condition
    // (animal, index) => ... = Function for each animal and index number
    // ! = Not operator
    // huntedIndices.has(index) = Is this index in the hunted list?
    // && = And operator - both conditions must be true
    animals = animals.filter((animal, index) => !huntedIndices.has(index) && animal.alive);
    
    // ... = Spread operator - separates array into its elements
    // push(...newAnimals) = add all elements from newAnimals array one by one
    animals.push(...newAnimals);
    
    // Return updated animals list
    return animals;
}

// ==================== ANA SİMÜLASYON DÖNGÜSÜ (MAIN SIMULATION LOOP) ====================

/**
 * Ana simülasyon döngüsü - Belirtilen adım sayısı kadar simülasyonu çalıştırır
 * Her adımda şu işlemler gerçekleşir:
 * 1. Afet/hastalık kontrolü
 * 2. Hayvan hareketleri  
 * 3. Avcı hareketi
 * 4. Avlanma ve çiftleşme işlemleri
 * 5. Ölü hayvanları temizleme
 * 
 * @param {Array} hayvanlar - Mevcut hayvanlar listesi
 * @param {Object} avci - Avcı nesnesi
 * @param {number} hareketSayisi - Kaç adım simülasyon çalıştırılacağı
 * @returns {Array} Simülasyon sonundaki hayvanlar listesi
 */
export function simulasyonuCalistir(hayvanlar, avci, hareketSayisi) {
    // Belirtilen adım sayısı kadar döngü çalıştır
    for (let adim = 0; adim < hareketSayisi; adim++) {
        // 1. Popülasyon kontrolü - gerekirse afet uygula
        gerekliiseAfetUygula(hayvanlar);
        
        // 2. Tüm hayvanları hareket ettir
        hayvanlar.forEach(hayvan => {
            if (hayvan.hayatta) {
                hayvan.hareket(avci, hayvanlar);
            }
        });
        
        // 3. Avcıyı hareket ettir
        avci.hareket();
        
        // 4. Avlanma ve çiftleşme işlemlerini gerçekleştir
        hayvanlar = avlanVeCiftles(hayvanlar, avci);
        
        // 5. Ölü hayvanları listeden çıkar (güvenlik için)
        hayvanlar = hayvanlar.filter(hayvan => hayvan.hayatta);
    }
    
    return hayvanlar;
}

// ==================== ÇALIŞTIRMA BLOĞU (EXECUTION BLOCK) ====================

/**
 * Bu blok dosya doğrudan çalıştırıldığında devreye girer
 * Simülasyonu başlatır ve sonuçları gösterir
 */
if (process.argv[1] && process.argv[1].endsWith('simulation-all-in-one.js')) {
    console.log("🌍 EKOSİSTEM SİMÜLASYONU BAŞLATIILIYOR...\n");
    
    // Başlangıç popülasyonunu oluştur
    const hayvanlar = hayvanlariBaslat();
    
    // Avcıyı rastgele pozisyonda oluştur
    const avci = new Avci(rastgelePozisyonAl(), rastgelePozisyonAl());
    
    // Başlangıç durumunu göster
    console.log("📊 BAŞLANGIÇ HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const baslangicSayilari = {};
    hayvanlar.forEach(hayvan => {
        baslangicSayilari[hayvan.tur] = (baslangicSayilari[hayvan.tur] || 0) + 1;
    });
    
    Object.entries(baslangicSayilari).forEach(([tur, sayi]) => {
        console.log(`${tur.toUpperCase().padEnd(8)}: ${sayi.toString().padStart(3)} adet`);
    });
    console.log("-".repeat(40));
    console.log(`TOPLAM  : ${hayvanlar.length.toString().padStart(3)} hayvan`);
    console.log(`AVCI    : 1 adet (Pozisyon: ${avci.x}, ${avci.y})`);
    
    console.log("\n🔄 SİMÜLASYON ÇALIŞIYOR... (1000 adım)");
    console.log("=" .repeat(50));
    
    // Simülasyonu 1000 adım çalıştır
    const zamanBaslangic = Date.now();
    const sonHayvanlar = simulasyonuCalistir(hayvanlar, avci, 1000);
    const zamanBitis = Date.now();
    const gecenSure = zamanBitis - zamanBaslangic;
    
    // Sonuçları göster
    console.log("\n🏁 SİMÜLASYON TAMAMLANDI!");
    console.log("=" .repeat(50));
    console.log(`⏱️  Geçen süre: ${gecenSure}ms`);
    
    console.log("\n📈 HAYATTA KALAN HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const sonSayilar = {};
    sonHayvanlar.forEach(hayvan => {
        if (!hayvan.hayatta) return;
        sonSayilar[hayvan.tur] = (sonSayilar[hayvan.tur] || 0) + 1;
    });
    
    Object.entries(sonSayilar).forEach(([tur, sayi]) => {
        const baslangicSayisi = baslangicSayilari[tur] || 0;
        const degisim = sayi - baslangicSayisi;
        const degisimMetni = degisim > 0 ? `(+${degisim})` : `(${degisim})`;
        const durum = degisim > 0 ? "📈" : degisim < 0 ? "📉" : "➡️ ";
        
        console.log(`${tur.toUpperCase().padEnd(8)}: ${sayi.toString().padStart(3)} adet ${durum} ${degisimMetni}`);
    });
    console.log("-".repeat(40));
    console.log(`TOPLAM  : ${sonHayvanlar.length.toString().padStart(3)} hayvan`);
    
    // İstatistikleri göster
    console.log("\n📊 DETAYLI İSTATİSTİKLER:");
    console.log("=" .repeat(40));
    const istatistikler = istatistikleriAl();
    console.log(`🐣 Doğan hayvan sayısı    : ${istatistikler.doganSayisi}`);
    console.log(`🏹 Avcının öldürdüğü      : ${istatistikler.avciOldurmeSayisi}`);
    console.log(`🦁 Aslanların öldürdüğü   : ${istatistikler.aslanOldurmeSayisi}`);
    console.log(`🐺 Kurtların öldürdüğü    : ${istatistikler.kurtOldurmeSayisi}`);
    console.log(`💀 Toplam ölüm           : ${istatistikler.avciOldurmeSayisi + istatistikler.aslanOldurmeSayisi + istatistikler.kurtOldurmeSayisi}`);
    
    console.log("\n🎯 SİMÜLASYON RAPORU TAMAMLANDI!");
}