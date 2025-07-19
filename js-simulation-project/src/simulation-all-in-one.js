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
    
    animals.forEach((animal, i) => {
        if (!animal.alive) return;
        
        if (animal.type === ANIMAL_TYPES.WOLF) {
            animals.forEach((prey, j) => {
                if (!prey.alive || i === j || huntedIndices.has(j)) return;
                
                if ((prey.type === ANIMAL_TYPES.SHEEP || 
                     prey.type === ANIMAL_TYPES.CHICKEN || 
                     prey.type === ANIMAL_TYPES.ROOSTER) && 
                    calculateDistance(animal, prey) <= HUNTING_DISTANCES[ANIMAL_TYPES.WOLF]) {
                    
                    if (Math.random() < 0.5) {
                        prey.alive = false;
                        huntedIndices.add(j);
                        animal.energy += 5;
                        wolfKillCount++;
                    }
                }
            });
        }
    });

    
    let matedIndices = new Set();
    
    for (let i = 0; i < animals.length; i++) {
        if (!animals[i].alive || matedIndices.has(i) || huntedIndices.has(i)) continue;
        
        if (animals[i].energy < 10) continue;
        
        for (let j = i + 1; j < animals.length; j++) {
            if (!animals[j].alive || matedIndices.has(j) || huntedIndices.has(j)) continue;
            if (animals[j].energy < 10) continue;
            
            if (animals[i].type === animals[j].type &&
                animals[i].gender !== animals[j].gender &&
                calculateDistance(animals[i], animals[j]) <= MATING_DISTANCE) {
                
                if (Math.random() > 0.15) continue;
                
                if ([ANIMAL_TYPES.SHEEP, ANIMAL_TYPES.COW, ANIMAL_TYPES.WOLF, ANIMAL_TYPES.LION].includes(animals[i].type)) {
                    const newX = Math.round((animals[i].x + animals[j].x) / 2);
                    const newY = Math.round((animals[i].y + animals[j].y) / 2);
                    
                    newAnimals.push(new Animal(
                        animals[i].type,
                        getRandomGender(),
                        newX,
                        newY
                    ));
                    
                    bornCount++;
                    matedIndices.add(i);
                    matedIndices.add(j);
                    
                    animals[i].energy -= 3;
                    animals[j].energy -= 3;
                    break;
                    
                } else if (animals[i].type === ANIMAL_TYPES.CHICKEN || animals[i].type === ANIMAL_TYPES.ROOSTER) {
                    const newX = Math.round((animals[i].x + animals[j].x) / 2);
                    const newY = Math.round((animals[i].y + animals[j].y) / 2);
                    
                    const newType = Math.random() < 0.7 ? ANIMAL_TYPES.CHICKEN : ANIMAL_TYPES.ROOSTER;
                    const newGender = newType === ANIMAL_TYPES.CHICKEN ? 'female' : 'male';
                    
                    newAnimals.push(new Animal(newType, newGender, newX, newY));
                    
                    bornCount++;
                    matedIndices.add(i);
                    matedIndices.add(j);
                    
                    animals[i].energy -= 3;
                    animals[j].energy -= 3;
                    break;
                }
            }
        }
    }
    animals = animals.filter((animal, index) => !huntedIndices.has(index) && animal.alive);
    
    animals.push(...newAnimals);
    
    return animals;
}

export function simulasyonuCalistir(hayvanlar, avci, hareketSayisi) {
    for (let adim = 0; adim < hareketSayisi; adim++) {
        applyDisasterIfNeeded(hayvanlar);
        
        hayvanlar.forEach(hayvan => {
            if (hayvan.alive) {
                hayvan.move(avci, hayvanlar);
            }
        });
        
        avci.move();
        
        hayvanlar = huntAndMate(hayvanlar, avci);
        
        hayvanlar = hayvanlar.filter(hayvan => hayvan.alive);
    }
    
    return hayvanlar;
}

if (process.argv[1] && process.argv[1].endsWith('simulation-all-in-one.js')) {
    console.log("🌍 EKOSİSTEM SİMÜLASYONU BAŞLATIILIYOR...\n");
    
    const hayvanlar = initializeAnimals();
    
    const avci = new Hunter(getRandomPosition(), getRandomPosition());
    
    console.log("📊 BAŞLANGIÇ HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const baslangicSayilari = {};
    hayvanlar.forEach(hayvan => {
        baslangicSayilari[hayvan.type] = (baslangicSayilari[hayvan.type] || 0) + 1;
    });
    
    Object.entries(baslangicSayilari).forEach(([tur, sayi]) => {
        console.log(`${tur.toUpperCase().padEnd(8)}: ${sayi.toString().padStart(3)} adet`);
    });
    console.log("-".repeat(40));
    console.log(`TOPLAM  : ${hayvanlar.length.toString().padStart(3)} hayvan`);
    console.log(`AVCI    : 1 adet (Pozisyon: ${avci.x}, ${avci.y})`);
    
    console.log("\n🔄 SİMÜLASYON ÇALIŞIYOR... (1000 adım)");
    console.log("=" .repeat(50));
    
    const zamanBaslangic = Date.now();
    const sonHayvanlar = simulasyonuCalistir(hayvanlar, avci, 1000);
    const zamanBitis = Date.now();
    const gecenSure = zamanBitis - zamanBaslangic;
    
    console.log("\n🏁 SİMÜLASYON TAMAMLANDI!");
    console.log("=" .repeat(50));
    console.log(`⏱️  Geçen süre: ${gecenSure}ms`);
    
    console.log("\n📈 HAYATTA KALAN HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const sonSayilar = {};
    sonHayvanlar.forEach(hayvan => {
        if (!hayvan.alive) return;
        sonSayilar[hayvan.type] = (sonSayilar[hayvan.type] || 0) + 1;
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
    
    console.log("\n📊 DETAYLI İSTATİSTİKLER:");
    console.log("=" .repeat(40));
    const istatistikler = getStats();
    console.log(`🐣 Doğan hayvan sayısı    : ${istatistikler.bornCount}`);
    console.log(`🏹 Avcının öldürdüğü      : ${istatistikler.hunterKillCount}`);
    console.log(`🦁 Aslanların öldürdüğü   : ${istatistikler.lionKillCount}`);
    console.log(`🐺 Kurtların öldürdüğü    : ${istatistikler.wolfKillCount}`);
    console.log(`💀 Toplam ölüm           : ${istatistikler.hunterKillCount + istatistikler.lionKillCount + istatistikler.wolfKillCount}`);
    
    console.log("\n🎯 SİMÜLASYON RAPORU TAMAMLANDI!");
}