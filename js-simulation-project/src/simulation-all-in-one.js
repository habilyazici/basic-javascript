/**
 * ECOSYSTEM SIMULATION - Advanced Wildlife Population Dynamics Model
 * 
 * This comprehensive simulation models complex interactions between various animal species
 * in a controlled ecosystem environment. The system demonstrates advanced programming
 * concepts including object-oriented design, statistical analysis, and algorithmic thinking.
 * 
 * Features:
 * - Multi-species population dynamics (Herbivores, Carnivores, Omnivores)
 * - Hunting behaviors with success rate calculations
 * - Breeding mechanics with energy requirements
 * - Disaster management and population control
 * - Advanced statistical tracking and analysis
 * - Real-time population trend monitoring
 * 
 * Technical Implementation:
 * - JavaScript ES6+ features (Classes, Arrow functions, Destructuring)
 * - Complex algorithms for spatial calculations and behavior modeling
 * - Comprehensive data analysis and reporting system
 * - Performance optimized simulation loop
 * 
 * @author Habil Yazıcı
 * @version 2.0
 * @date 2025
 */

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

const ANIMAL_TYPES = {
    SHEEP: 'sheep',
    COW: 'cow',
    CHICKEN: 'chicken',
    ROOSTER: 'rooster',
    WOLF: 'wolf',
    LION: 'lion'
};

const HUNTER_TYPE = 'hunter';

// Predator hunting range configurations
const HUNTING_DISTANCES = {
    [ANIMAL_TYPES.WOLF]: 4,    // Wolves: Medium range hunters
    [ANIMAL_TYPES.LION]: 5     // Lions: Long range apex predators
};

// Breeding proximity requirements
const MATING_DISTANCE = 3;

// Species-specific movement capabilities
const MOVEMENT_DISTANCES = {
    [ANIMAL_TYPES.SHEEP]: 2,     // Moderate herbivore mobility
    [ANIMAL_TYPES.COW]: 2,       // Large herbivore, steady movement
    [ANIMAL_TYPES.CHICKEN]: 1,   // Small bird, limited range
    [ANIMAL_TYPES.ROOSTER]: 1,   // Small bird, limited range
    [ANIMAL_TYPES.WOLF]: 3,      // Agile predator, high mobility
    [ANIMAL_TYPES.LION]: 4,      // Apex predator, maximum mobility
    [HUNTER_TYPE]: 1             // Human hunter, strategic movement
};

// Simulation environment constants
const WORLD_SIZE = 500;
const ENERGY_DECAY_CHANCE = 0.1;
const HUNTER_VISION_RANGE = 8;
const DISASTER_THRESHOLD = 100;
const SNAPSHOT_INTERVAL = 100;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a random position within the simulation world
 * @returns {number} Random coordinate between 0 and WORLD_SIZE-1
 */
function getRandomPosition() {
    return Math.floor(Math.random() * WORLD_SIZE);
}

/**
 * Randomly determines gender for new animals
 * @returns {string} Either 'male' or 'female'
 */
function getRandomGender() {
    return Math.random() < 0.5 ? 'male' : 'female';
}

/**
 * Calculates Manhattan distance between two entities
 * @param {Object} a First entity with x,y coordinates
 * @param {Object} b Second entity with x,y coordinates
 * @returns {number} Manhattan distance
 */
function calculateDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Returns appropriate emoji for species visualization
 * @param {string} type Species type
 * @returns {string} Emoji representation
 */
function getSpeciesEmoji(type) {
    const emojiMap = {
        sheep: '🐑',
        cow: '🐄',
        chicken: '🐔',
        rooster: '🐓',
        wolf: '🐺',
        lion: '🦁'
    };
    return emojiMap[type] || '🐾';
}

// ============================================================================
// CORE CLASSES
// ============================================================================

/**
 * Animal class representing all wildlife entities in the ecosystem
 * Features comprehensive lifecycle tracking and behavioral modeling
 */
class Animal {
    /**
     * Creates a new animal instance
     * @param {string} type - Species type from ANIMAL_TYPES
     * @param {string} gender - 'male' or 'female'
     * @param {number} x - Initial X coordinate
     * @param {number} y - Initial Y coordinate
     */
    constructor(type, gender, x, y) {
        this.type = type;
        this.gender = gender;
        this.x = x;
        this.y = y;
        this.energy = 100;           // Starting energy level
        this.alive = true;           // Vital status
        this.age = 0;                // Age in simulation steps
        this.birthStep = 0;          // Birth timestamp
        this.totalDistance = 0;      // Cumulative movement distance
        this.matingCount = 0;        // Number of successful reproductions
    }

    /**
     * Handles animal movement and energy management
     * Implements species-specific movement patterns and energy decay
     * @param {Hunter} hunter - Hunter entity for potential interaction
     * @param {Animal[]} animals - Array of all animals for environmental awareness
     */
    move(hunter, animals) {
        const movementDistance = MOVEMENT_DISTANCES[this.type];
        
        // Movement directions: North, East, South, West
        const dx = [0, 1, 0, -1];
        const dy = [1, 0, -1, 0];
        
        const direction = Math.floor(Math.random() * 4);
        
        // Track movement for statistics
        const oldX = this.x;
        const oldY = this.y;
        
        // Apply movement with world boundaries
        this.x = Math.max(0, Math.min(WORLD_SIZE - 1, this.x + dx[direction] * movementDistance));
        this.y = Math.max(0, Math.min(WORLD_SIZE - 1, this.y + dy[direction] * movementDistance));
        
        // Update tracking statistics
        this.totalDistance += Math.abs(this.x - oldX) + Math.abs(this.y - oldY);
        totalMovements++;
        this.age++;
        
        // Random energy decay simulation
        if (Math.random() < ENERGY_DECAY_CHANCE) {
            this.energy = Math.max(0, this.energy - 1);
        }
        
        // Handle energy depletion death
        if (this.energy === 0) {
            this.alive = false;
            energyDeaths++;
            typeStats[this.type].energyDeath++;
        }
    }
}

/**
 * Hunter class representing the human predator element
 * Implements advanced vision-based hunting strategies
 */
class Hunter {
    /**
     * Creates a new hunter instance
     * @param {number} x - Initial X coordinate
     * @param {number} y - Initial Y coordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visionRange = HUNTER_VISION_RANGE;
    }

    /**
     * Executes hunter movement with strategic positioning
     * Hunters move more methodically than wild animals
     */
    move() {
        const dx = [0, 1, 0, -1];
        const dy = [1, 0, -1, 0];
        const direction = Math.floor(Math.random() * 4);
        
        this.x = Math.max(0, Math.min(WORLD_SIZE - 1, this.x + dx[direction] * MOVEMENT_DISTANCES[HUNTER_TYPE]));
        this.y = Math.max(0, Math.min(WORLD_SIZE - 1, this.y + dy[direction] * MOVEMENT_DISTANCES[HUNTER_TYPE]));
    }
}

// ============================================================================
// STATISTICAL TRACKING SYSTEM
// ============================================================================

// ============================================================================
// STATISTICAL TRACKING SYSTEM
// ============================================================================

// Core demographic counters
let bornCount = 0;
let hunterKillCount = 0;
let lionKillCount = 0;
let wolfKillCount = 0;

// Advanced behavioral analytics
let matingAttempts = 0;
let successfulMatings = 0;
let huntingAttempts = { 
    hunter: 0, 
    lion: 0, 
    wolf: 0 
};
let energyDeaths = 0;
let disasterDeaths = 0;
let totalMovements = 0;
let stepData = [];

// Species-specific comprehensive statistics
let typeStats = {
    sheep: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    cow: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    chicken: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    rooster: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    wolf: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 },
    lion: { born: 0, died: 0, hunted: 0, energyDeath: 0, maxPopulation: 0 }
};

// ============================================================================
// ANALYTICS AND REPORTING FUNCTIONS
// ============================================================================

function getStats() {
    return { 
        bornCount,
        hunterKillCount,
        lionKillCount,
        wolfKillCount
    };
}

function getAdvancedStats(animals, currentStep) {
    // Mevcut popülasyon hesaplamaları
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
            
            // Maksimum popülasyon güncelleme
            if (currentCounts[animal.type] > typeStats[animal.type].maxPopulation) {
                typeStats[animal.type].maxPopulation = currentCounts[animal.type];
            }
        }
    });
    
    const aliveCount = animals.filter(a => a.alive).length;
    
    return {
        // Temel istatistikler
        totalBorn: bornCount,
        totalDeaths: hunterKillCount + lionKillCount + wolfKillCount + energyDeaths + disasterDeaths,
        currentPopulation: aliveCount,
        
        // Avcılık istatistikleri
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
        
        // Üreme istatistikleri
        breedingStats: {
            matingAttempts,
            successfulMatings,
            breedingSuccessRate: matingAttempts > 0 ? (successfulMatings / matingAttempts * 100).toFixed(1) : 0
        },
        
        // Yaşam istatistikleri
        lifeStats: {
            averageEnergy: aliveCount > 0 ? (totalEnergy / aliveCount).toFixed(1) : 0,
            averageAge: aliveCount > 0 ? (totalAge / aliveCount).toFixed(1) : 0,
            oldestAnimal,
            energyDeaths,
            disasterDeaths,
            averageMovementDistance: aliveCount > 0 ? (totalDistance / aliveCount).toFixed(1) : 0
        },
        
        // Tür bazlı detaylar
        typeDetails: typeStats,
        
        // Popülasyon yoğunluğu
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
    
    // Tür istatistiklerini sıfırla
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
            console.log(`AFET/HASTALIK: ${type} popülasyonu kritik seviyede (${count}), %20'si hastalandı!`);
            
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
    
    // Avcı avcılığı
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
    
    // Aslan avcılığı
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
    
    // Kurt avcılığı
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

    // Üreme
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
                    
                    const newAnimal = new Animal(
                        animals[i].type,
                        getRandomGender(),
                        newX,
                        newY
                    );
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
        
        // Her 100 adımda bir snapshot al
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

// ============================================================================
// MAIN SIMULATION EXECUTION
// ============================================================================

if (process.argv[1] && process.argv[1].endsWith('simulation-all-in-one.js')) {
    console.log("╔══════════════════════════════════════════════════════════════╗");
    console.log("║              ADVANCED ECOSYSTEM SIMULATION v2.0             ║");
    console.log("║          Wildlife Population Dynamics & Analytics           ║");
    console.log("╚══════════════════════════════════════════════════════════════╝\n");
    
    // Initialize ecosystem components
    console.log("🔧 INITIALIZING ECOSYSTEM COMPONENTS...");
    const animals = initializeAnimals();
    const hunter = new Hunter(getRandomPosition(), getRandomPosition());
    
    // Display initial population statistics
    console.log("\n📊 INITIAL POPULATION DISTRIBUTION:");
    console.log("═".repeat(50));
    const initialCounts = {};
    animals.forEach(animal => {
        initialCounts[animal.type] = (initialCounts[animal.type] || 0) + 1;
    });
    
    Object.entries(initialCounts).forEach(([type, count]) => {
        const emoji = getSpeciesEmoji(type);
        console.log(`${emoji} ${type.toUpperCase().padEnd(8)}: ${count.toString().padStart(3)} individuals`);
    });
    console.log("─".repeat(50));
    console.log(`🌍 TOTAL WILDLIFE : ${animals.length.toString().padStart(3)} animals`);
    console.log(`👨‍🏫 HUNTER POSITION: (${hunter.x}, ${hunter.y})`);
    
    console.log("\n⚡ EXECUTING SIMULATION... (1000 iterations)");
    console.log("═".repeat(55));
    
    const startTime = Date.now();
    const finalAnimals = runSimulation(animals, hunter, 1000);
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    
    console.log("\n✅ SIMULATION COMPLETED SUCCESSFULLY!");
    console.log("═".repeat(60));
    console.log(`⏱️  Execution Time: ${elapsedTime}ms | Performance: ${(1000000 / elapsedTime).toFixed(0)} steps/sec`);
    
    console.log("\n🏆 FINAL POPULATION ANALYSIS:");
    console.log("═".repeat(50));
    const finalCounts = {};
    finalAnimals.forEach(animal => {
        if (!animal.alive) return;
        finalCounts[animal.type] = (finalCounts[animal.type] || 0) + 1;
    });
    
    Object.entries(finalCounts).forEach(([type, count]) => {
        const initialCount = initialCounts[type] || 0;
        const change = count - initialCount;
        const changeText = change > 0 ? `(+${change})` : `(${change})`;
        const statusEmoji = change > 0 ? "📈" : change < 0 ? "📉" : "➡️";
        const emoji = getSpeciesEmoji(type);
        
        console.log(`${emoji} ${type.toUpperCase().padEnd(8)}: ${count.toString().padStart(3)} survivors ${statusEmoji} ${changeText}`);
    });
    console.log("─".repeat(50));
    console.log(`🌍 TOTAL SURVIVORS: ${finalAnimals.length.toString().padStart(3)} animals`);
    
    console.log("\n📊 COMPREHENSIVE ECOSYSTEM ANALYTICS:");
    console.log("═".repeat(70));
    const advancedStats = getAdvancedStats(finalAnimals, 1000);
    
    // Genel Bilgiler
    console.log("GENEL BİLGİLER:");
    console.log(`Toplam doğum               : ${advancedStats.totalBorn}`);
    console.log(`Toplam ölüm                : ${advancedStats.totalDeaths}`);
    console.log(`Mevcut popülasyon          : ${advancedStats.currentPopulation}`);
    
    // Avcılık İstatistikleri
    console.log("\nAVCILIK PERFORMANSI:");
    console.log(`Avcı başarı oranı          : %${advancedStats.huntingStats.hunterSuccessRate} (${advancedStats.huntingStats.hunterKills}/${advancedStats.huntingStats.hunterAttempts})`);
    console.log(`Aslan başarı oranı         : %${advancedStats.huntingStats.lionSuccessRate} (${advancedStats.huntingStats.lionKills}/${advancedStats.huntingStats.lionAttempts})`);
    console.log(`Kurt başarı oranı          : %${advancedStats.huntingStats.wolfSuccessRate} (${advancedStats.huntingStats.wolfKills}/${advancedStats.huntingStats.wolfAttempts})`);
    
    // Üreme İstatistikleri
    console.log("\nÜREME İSTATİSTİKLERİ:");
    console.log(`Çiftleşme girişimi         : ${advancedStats.breedingStats.matingAttempts}`);
    console.log(`Başarılı çiftleşme         : ${advancedStats.breedingStats.successfulMatings}`);
    console.log(`Üreme başarı oranı         : %${advancedStats.breedingStats.breedingSuccessRate}`);
    
    // Yaşam İstatistikleri
    console.log("\nYAŞAM İSTATİSTİKLERİ:");
    console.log(`Ortalama enerji seviyesi   : ${advancedStats.lifeStats.averageEnergy}`);
    console.log(`Ortalama yaş               : ${advancedStats.lifeStats.averageAge} adım`);
    console.log(`En yaşlı hayvan           : ${advancedStats.lifeStats.oldestAnimal} adım`);
    console.log(`Enerji tükenmesi ölümü     : ${advancedStats.lifeStats.energyDeaths}`);
    console.log(`Afet/hastalık ölümü        : ${advancedStats.lifeStats.disasterDeaths}`);
    
    // Tür Bazlı Detaylar
    console.log("\nTÜR BAZLI DETAYLAR:");
    Object.entries(advancedStats.typeDetails).forEach(([type, stats]) => {
        if (stats.born > 0 || stats.died > 0) {
            console.log(`${type.toUpperCase().padEnd(8)}: Doğum=${stats.born} | Ölüm=${stats.died} | Avlandı=${stats.hunted} | Enerji ölümü=${stats.energyDeath} | Max Pop=${stats.maxPopulation}`);
        }
    });
    
    // Popülasyon Eğilimi (detaylı analiz)
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
            
            // Tür bazlı detaylar
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
        
        // Genel eğilim analizi
        const firstSnapshot = stepData[0];
        const lastSnapshot = stepData[stepData.length - 1];
        const totalChange = lastSnapshot.population - firstSnapshot.population;
        const percentageChange = ((totalChange / firstSnapshot.population) * 100).toFixed(1);
        
        console.log("\nGENEL EĞİLİM ÖZETI:");
        console.log(`Başlangıç popülasyonu      : ${firstSnapshot.population} hayvan`);
        console.log(`Son popülasyon             : ${lastSnapshot.population} hayvan`);
        console.log(`Net değişim                : ${totalChange > 0 ? '+' : ''}${totalChange} hayvan (%${percentageChange})`);
        
        // En yüksek ve en düşük popülasyon
        const maxPop = Math.max(...stepData.map(s => s.population));
        const minPop = Math.min(...stepData.map(s => s.population));
        console.log(`En yüksek popülasyon       : ${maxPop} hayvan`);
        console.log(`En düşük popülasyon        : ${minPop} hayvan`);
        console.log(`🌍 Population Range Variation: ${maxPop - minPop} animals`);
    }
    
    console.log("\n" + "═".repeat(70));
    console.log("🎯 ECOSYSTEM SIMULATION ANALYSIS COMPLETED");
    console.log("   Advanced Wildlife Population Modeling Demonstration");
    console.log("   Showcasing: OOP Design, Statistical Analysis, Algorithm Design");
    console.log("═".repeat(70));
}