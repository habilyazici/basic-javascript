const ANIMAL_TYPES = {
    SHEEP: 'sheep',
    COW: 'cow',
    CHICKEN: 'chicken',
    ROOSTER: 'rooster',
    WOLF: 'wolf',
    LION: 'lion'
};

const HUNTER_TYPE = 'hunter';
const HUNTING_DISTANCES = {
    [ANIMAL_TYPES.WOLF]: 4,
    [ANIMAL_TYPES.LION]: 5
};
const MATING_DISTANCE = 3;
const MOVEMENT_DISTANCES = {
    [ANIMAL_TYPES.SHEEP]: 2,
    [ANIMAL_TYPES.COW]: 2,
    [ANIMAL_TYPES.CHICKEN]: 1,
    [ANIMAL_TYPES.ROOSTER]: 1,
    [ANIMAL_TYPES.WOLF]: 3,
    [ANIMAL_TYPES.LION]: 4,
    [HUNTER_TYPE]: 1
};

function getRandomPosition() {
    return Math.floor(Math.random() * 500);
}

function getRandomGender() {
    return Math.random() < 0.5 ? 'male' : 'female';
}

function calculateDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

class Animal {
    constructor(type, gender, x, y) {
        this.type = type;
        this.gender = gender;
        this.x = x;
        this.y = y;
        this.energy = 100;
        this.alive = true;
        this.age = 0;
        this.birthStep = 0;
        this.totalDistance = 0;
        this.matingCount = 0;
    }

    move(hunter, animals) {
        const movementDistance = MOVEMENT_DISTANCES[this.type];
        const dx = [0, 1, 0, -1];
        const dy = [1, 0, -1, 0];
        const direction = Math.floor(Math.random() * 4);
        const oldX = this.x;
        const oldY = this.y;
        
        this.x = Math.max(0, Math.min(499, this.x + dx[direction] * movementDistance));
        this.y = Math.max(0, Math.min(499, this.y + dy[direction] * movementDistance));
        this.totalDistance += Math.abs(this.x - oldX) + Math.abs(this.y - oldY);
        totalMovements++;
        this.age++;
        
        if (Math.random() < 0.1) {
            this.energy = Math.max(0, this.energy - 1);
        }
        
        if (this.energy === 0) {
            this.alive = false;
            energyDeaths++;
            typeStats[this.type].energyDeath++;
        }
    }
}

class Hunter {
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
let matingAttempts = 0;
let successfulMatings = 0;
let huntingAttempts = { hunter: 0, lion: 0, wolf: 0 };
let energyDeaths = 0;
let disasterDeaths = 0;
let totalMovements = 0;
let stepData = [];

let typeStats = {
    sheep: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    cow: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    chicken: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    rooster: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    wolf: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    lion: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 }
};

function getStats() {
    return { 
        bornCount,
        hunterKillCount,
        lionKillCount,
        wolfKillCount
    };
}

function getAdvancedStats(animals, currentStep) {
    const currentCounts = {};
    let totalEnergy = 0;
    let totalAge = 0;
    let totalDistance = 0;
    let oldestAnimal = 0;
    
    animals.forEach(animal => {
        if (animal.alive) {
            currentCounts[animal.type] = (currentCounts[animal.type] || 0) + 1;
            totalEnergy += animal.energy;
            totalAge += animal.age;
            totalDistance += animal.totalDistance;
            oldestAnimal = Math.max(oldestAnimal, animal.age);
            
            if (currentCounts[animal.type] > typeStats[animal.type].maxPopulation) {
                typeStats[animal.type].maxPopulation = currentCounts[animal.type];
            }
        }
    });
    
    const aliveCount = animals.filter(a => a.alive).length;
    
    return {
        totalBorn: bornCount,
        totalDeaths: hunterKillCount + lionKillCount + wolfKillCount + energyDeaths + disasterDeaths,
        currentPopulation: aliveCount,
        huntingStats: {
            hunterKills: hunterKillCount,
            lionKills: lionKillCount,
            wolfKills: wolfKillCount,
            hunterAttempts: huntingAttempts.hunter,
            lionAttempts: huntingAttempts.lion,
            wolfAttempts: huntingAttempts.wolf,
            hunterSuccessRate: huntingAttempts.hunter > 0 ? (hunterKillCount / huntingAttempts.hunter * 100).toFixed(1) : 0,
            lionSuccessRate: huntingAttempts.lion > 0 ? (lionKillCount / huntingAttempts.lion * 100).toFixed(1) : 0,
            wolfSuccessRate: huntingAttempts.wolf > 0 ? (wolfKillCount / huntingAttempts.wolf * 100).toFixed(1) : 0
        },
        breedingStats: {
            matingAttempts,
            successfulMatings,
            breedingSuccessRate: matingAttempts > 0 ? (successfulMatings / matingAttempts * 100).toFixed(1) : 0
        },
        lifeStats: {
            averageEnergy: aliveCount > 0 ? (totalEnergy / aliveCount).toFixed(1) : 0,
            averageAge: aliveCount > 0 ? (totalAge / aliveCount).toFixed(1) : 0,
            oldestAnimal,
            energyDeaths,
            disasterDeaths,
            averageMovementDistance: aliveCount > 0 ? (totalDistance / aliveCount).toFixed(1) : 0
        },
        typeDetails: typeStats,
        populationDensity: (aliveCount / (500 * 500) * 10000).toFixed(4)
    };
}

function resetStats() {
    bornCount = 0;
    hunterKillCount = 0;
    lionKillCount = 0;
    wolfKillCount = 0;
    matingAttempts = 0;
    successfulMatings = 0;
    huntingAttempts = { hunter: 0, lion: 0, wolf: 0 };
    energyDeaths = 0;
    disasterDeaths = 0;
    totalMovements = 0;
    stepData = [];
    
    Object.keys(typeStats).forEach(type => {
        typeStats[type] = { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 };
    });
}

function initializeAnimals() {
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

function applyDisasterIfNeeded(animals) {
    const typeCounts = {};
    
    animals.forEach(animal => {
        if (!typeCounts[animal.type]) typeCounts[animal.type] = 0;
        if (animal.alive) typeCounts[animal.type]++;
    });
    
    Object.entries(typeCounts).forEach(([type, count]) => {
        if (count > 100) {
            console.log(`AFET/HASTALIK: ${type} popülasyonu kritik seviyede (${count}), %20'si etkilendi!`);
            
            let killedCount = 0;
            const killTarget = Math.floor(count * 0.2);
            
            animals.forEach(animal => {
                if (animal.type === type && animal.alive && killedCount < killTarget && Math.random() < 0.25) {
                    animal.alive = false;
                    killedCount++;
                    disasterDeaths++;
                    typeStats[type].died++;
                }
            });
            
            console.log(`${killedCount} ${type} hastalandı ve öldü.`);
        }
    });
}

function huntAndMate(animals, hunter, currentStep) {
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
    
    if (closestIndex !== -1) {
        huntingAttempts.hunter++;
        if (Math.random() < 0.3) {
            animals[closestIndex].alive = false;
            huntedIndices.add(closestIndex);
            hunterKillCount++;
            typeStats[animals[closestIndex].type].hunted++;
            typeStats[animals[closestIndex].type].died++;
        }
    }
    animals.forEach((animal, i) => {
        if (!animal.alive) return;
        
        if (animal.type === ANIMAL_TYPES.LION) {
            animals.forEach((prey, j) => {
                if (!prey.alive || i === j || huntedIndices.has(j)) return;
                
                if ((prey.type === ANIMAL_TYPES.SHEEP || prey.type === ANIMAL_TYPES.COW) && 
                    calculateDistance(animal, prey) <= HUNTING_DISTANCES[ANIMAL_TYPES.LION]) {
                    huntingAttempts.lion++;
                    if (Math.random() < 0.5) {
                        prey.alive = false;
                        huntedIndices.add(j);
                        animal.energy += 5;
                        lionKillCount++;
                        typeStats[prey.type].hunted++;
                        typeStats[prey.type].died++;
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
                    huntingAttempts.wolf++;
                    if (Math.random() < 0.5) {
                        prey.alive = false;
                        huntedIndices.add(j);
                        animal.energy += 5;
                        wolfKillCount++;
                        typeStats[prey.type].hunted++;
                        typeStats[prey.type].died++;
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
                
                matingAttempts++;
                if (Math.random() > 0.15) continue;
                successfulMatings++;
                
                if ([ANIMAL_TYPES.SHEEP, ANIMAL_TYPES.COW, ANIMAL_TYPES.WOLF, ANIMAL_TYPES.LION].includes(animals[i].type)) {
                    const newX = Math.round((animals[i].x + animals[j].x) / 2);
                    const newY = Math.round((animals[i].y + animals[j].y) / 2);
                    const newAnimal = new Animal(animals[i].type, getRandomGender(), newX, newY);
                    newAnimal.birthStep = currentStep;
                    newAnimals.push(newAnimal);
                    
                    bornCount++;
                    typeStats[animals[i].type].born++;
                    matedIndices.add(i);
                    matedIndices.add(j);
                    animals[i].energy -= 3;
                    animals[j].energy -= 3;
                    animals[i].matingCount++;
                    animals[j].matingCount++;
                    break;
                    
                } else if (animals[i].type === ANIMAL_TYPES.CHICKEN || animals[i].type === ANIMAL_TYPES.ROOSTER) {
                    const newX = Math.round((animals[i].x + animals[j].x) / 2);
                    const newY = Math.round((animals[i].y + animals[j].y) / 2);
                    const newType = Math.random() < 0.7 ? ANIMAL_TYPES.CHICKEN : ANIMAL_TYPES.ROOSTER;
                    const newGender = newType === ANIMAL_TYPES.CHICKEN ? 'female' : 'male';
                    const newAnimal = new Animal(newType, newGender, newX, newY);
                    newAnimal.birthStep = currentStep;
                    newAnimals.push(newAnimal);
                    
                    bornCount++;
                    typeStats[newType].born++;
                    matedIndices.add(i);
                    matedIndices.add(j);
                    animals[i].energy -= 3;
                    animals[j].energy -= 3;
                    animals[i].matingCount++;
                    animals[j].matingCount++;
                    break;
                }
            }
        }
    }
    
    animals = animals.filter((animal, index) => !huntedIndices.has(index) && animal.alive);
    animals.push(...newAnimals);
    return animals;
}

function runSimulation(animals, hunter, stepCount) {
    for (let step = 0; step < stepCount; step++) {
        applyDisasterIfNeeded(animals);
        
        animals.forEach(animal => {
            if (animal.alive) {
                animal.move(hunter, animals);
            }
        });
        
        hunter.move();
        animals = huntAndMate(animals, hunter, step);
        animals = animals.filter(animal => animal.alive);
        
        if (step % 100 === 0) {
            const currentCounts = {};
            animals.forEach(animal => {
                if (animal.alive) {
                    currentCounts[animal.type] = (currentCounts[animal.type] || 0) + 1;
                }
            });
            stepData.push({
                step,
                population: animals.filter(a => a.alive).length,
                counts: { ...currentCounts }
            });
        }
    }
    
    return animals;
}

if (process.argv[1] && process.argv[1].endsWith('simulation-all-in-one.js')) {
    console.log("EKOSİSTEM SİMÜLASYONU BAŞLATILIYOR...\n");
    
    const animals = initializeAnimals();
    
    const hunter = new Hunter(getRandomPosition(), getRandomPosition());
    
    console.log("BAŞLANGIÇ HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const initialCounts = {};
    animals.forEach(animal => {
        initialCounts[animal.type] = (initialCounts[animal.type] || 0) + 1;
    });
    
    Object.entries(initialCounts).forEach(([type, count]) => {
        console.log(`${type.toUpperCase().padEnd(8)}: ${count.toString().padStart(3)} adet`);
    });
    console.log("-".repeat(40));
    console.log(`TOPLAM  : ${animals.length.toString().padStart(3)} hayvan`);
    console.log(`AVCISI  : 1 adet (Konum: ${hunter.x}, ${hunter.y})`);
    
    console.log("\nSİMÜLASYON ÇALIŞIYOR... (1000 adım)");
    console.log("=" .repeat(50));
    
    const startTime = Date.now();
    const finalAnimals = runSimulation(animals, hunter, 1000);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    
    console.log("\nSİMÜLASYON TAMAMLANDI!");
    console.log("=" .repeat(50));
    console.log(`Geçen süre: ${elapsedTime}ms`);
    
    console.log("\nHAYATTA KALAN HAYVAN SAYILARI:");
    console.log("=" .repeat(40));
    const finalCounts = {};
    finalAnimals.forEach(animal => {
        if (!animal.alive) return;
        finalCounts[animal.type] = (finalCounts[animal.type] || 0) + 1;
    });
    
    Object.entries(finalCounts).forEach(([type, count]) => {
        const initialCount = initialCounts[type] || 0;
        const change = count - initialCount;
        const changeText = change > 0 ? `(+${change})` : `(${change})`;
        const status = change > 0 ? "ARTIŞ" : change < 0 ? "AZALIŞ" : "AYNI";
        
        console.log(`${type.toUpperCase().padEnd(8)}: ${count.toString().padStart(3)} adet ${status} ${changeText}`);
    });
    console.log("-".repeat(40));
    console.log(`TOPLAM  : ${finalAnimals.length.toString().padStart(3)} hayvan`);
    
    console.log("\nGELİŞMİŞ İSTATİSTİKLER:");
    console.log("=" .repeat(60));
    const advancedStats = getAdvancedStats(finalAnimals, 1000);
    
    console.log("GENEL BİLGİLER:");
    console.log(`Toplam doğum               : ${advancedStats.totalBorn}`);
    console.log(`Toplam ölüm                : ${advancedStats.totalDeaths}`);
    console.log(`Mevcut popülasyon          : ${advancedStats.currentPopulation}`);
    
    console.log("\nAV PERFORMANSI:");
    console.log(`Avcı başarı oranı          : %${advancedStats.huntingStats.hunterSuccessRate} (${advancedStats.huntingStats.hunterKills}/${advancedStats.huntingStats.hunterAttempts})`);
    console.log(`Aslan başarı oranı         : %${advancedStats.huntingStats.lionSuccessRate} (${advancedStats.huntingStats.lionKills}/${advancedStats.huntingStats.lionAttempts})`);
    console.log(`Kurt başarı oranı          : %${advancedStats.huntingStats.wolfSuccessRate} (${advancedStats.huntingStats.wolfKills}/${advancedStats.huntingStats.wolfAttempts})`);
    
    console.log("\nÜREME İSTATİSTİKLERİ:");
    console.log(`Çiftleşme denemeleri       : ${advancedStats.breedingStats.matingAttempts}`);
    console.log(`Başarılı çiftleşmeler      : ${advancedStats.breedingStats.successfulMatings}`);
    console.log(`Üreme başarı oranı         : %${advancedStats.breedingStats.breedingSuccessRate}`);
    
    console.log("\nYAŞAM İSTATİSTİKLERİ:");
    console.log(`Ortalama enerji seviyesi   : ${advancedStats.lifeStats.averageEnergy}`);
    console.log(`Ortalama yaş               : ${advancedStats.lifeStats.averageAge} adım`);
    console.log(`En yaşlı hayvan           : ${advancedStats.lifeStats.oldestAnimal} adım`);
    console.log(`Enerji tükenmesi ölümleri  : ${advancedStats.lifeStats.energyDeaths}`);
    console.log(`Afet/hastalık ölümleri     : ${advancedStats.lifeStats.disasterDeaths}`);
    
    console.log("\nTÜR BAZLI DETAYLAR:");
    Object.entries(advancedStats.typeDetails).forEach(([type, stats]) => {
        if (stats.born > 0 || stats.died > 0) {
            console.log(`${type.toUpperCase().padEnd(8)}: Doğum=${stats.born} | Ölüm=${stats.died} | Avlandı=${stats.hunted} | Enerji ölümü=${stats.energyDeath} | Max Pop=${stats.maxPopulation}`);
        }
    });
    
    if (stepData.length > 0) {
        console.log("\nPOPÜLASYON EĞİLİMİ ANALİZİ:");
        console.log("=" .repeat(80));
        
        const lastSnapshots = stepData.slice(-10);
        lastSnapshots.forEach((snapshot, index) => {
            const prevSnapshot = index > 0 ? lastSnapshots[index - 1] : stepData[0];
            const popChange = snapshot.population - prevSnapshot.population;
            const changeText = popChange > 0 ? `(+${popChange})` : popChange < 0 ? `(${popChange})` : "(0)";
            const trend = popChange > 0 ? "↗" : popChange < 0 ? "↘" : "→";
            
            console.log(`Adım ${snapshot.step.toString().padStart(4)}: ${snapshot.population.toString().padStart(3)} hayvan ${trend} ${changeText}`);
        
            const typeDetails = [];
            Object.entries(snapshot.counts).forEach(([type, count]) => {
                if (count > 0) {
                    typeDetails.push(`${type}: ${count}`);
                }
            });
            
            if (typeDetails.length > 0) {
                console.log(`              └─ ${typeDetails.join(' | ')}`);
            }
        });
        
        const firstSnapshot = stepData[0];
        const lastSnapshot = stepData[stepData.length - 1];
        const totalChange = lastSnapshot.population - firstSnapshot.population;
        const percentageChange = ((totalChange / firstSnapshot.population) * 100).toFixed(1);
        
        console.log("\nGENEL EĞİLİM ÖZETI:");
        console.log(`Başlangıç popülasyonu      : ${firstSnapshot.population} hayvan`);
        console.log(`Son popülasyon             : ${lastSnapshot.population} hayvan`);
        console.log(`Net değişim                : ${totalChange > 0 ? '+' : ''}${totalChange} hayvan (%${percentageChange})`);

        const maxPop = Math.max(...stepData.map(s => s.population));
        const minPop = Math.min(...stepData.map(s => s.population));
        console.log(`En yüksek popülasyon       : ${maxPop} hayvan`);
        console.log(`En düşük popülasyon        : ${minPop} hayvan`);
    }
    console.log("\nSİMÜLASYON RAPORU TAMAMLANDI!");
}