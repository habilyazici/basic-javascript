// ==================== CONSTANTS ====================
// Constants: Values that won't change throughout the program
// These numbers and strings will remain the same throughout program execution

/**
 * Animal Types - Definitions of all animal types used in the simulation
 * These constants are used to maintain consistency throughout the code
 * 
 * EXPLANATION: Object structure - we write key:value pairs inside {}
 * Example: SHEEP: 'sheep' - the SHEEP key has the value 'sheep' string
 */
export const ANIMAL_TYPES = {
    SHEEP: 'sheep',        // Herbivore, defenseless animal - only eats grass
    COW: 'cow',            // Herbivore, large animal - only eats grass but large
    CHICKEN: 'chicken',    // Omnivore, small animal (female) - eats both plants and meat
    ROOSTER: 'rooster',    // Omnivore, small animal (male) - eats both plants and meat
    WOLF: 'wolf',          // Carnivore predator - only eats meat, hunts other animals
    LION: 'lion'           // Carnivore predator - only eats meat, strongest predator
};
// export = Makes this variable available for use in other files
// const = Immutable variable (constant) declaration keyword

/**
 * Hunter Type - Human hunter
 * EXPLANATION: A constant of string type
 * This variable represents the human hunter
 */
export const HUNTER_TYPE = 'hunter';

/**
 * Hunting Distances - How far each predator type can hunt from
 * Larger predators can hunt from greater distances
 * 
 * EXPLANATION: Object with animal type as key and distance as value
 * [ANIMAL_TYPES.WOLF] = Creates object key using square brackets
 * Number values represent distance in pixels
 */
export const HUNTING_DISTANCES = {
    [ANIMAL_TYPES.WOLF]: 4,    // Wolf can hunt from 4 units away
    [ANIMAL_TYPES.LION]: 5     // Lion can hunt from 5 units away
};

/**
 * Mating Distance - Maximum distance between animals for mating to occur
 * EXPLANATION: Just a number constant. Animals within this distance can mate
 */
export const MATING_DISTANCE = 3;

/**
 * Movement Distances - How far each animal type can move in one step
 * Larger animals generally move faster
 */
export const MOVEMENT_DISTANCES = {
    [ANIMAL_TYPES.SHEEP]: 2,     // Sheep moves at medium speed
    [ANIMAL_TYPES.COW]: 2,       // Cow moves at medium speed
    [ANIMAL_TYPES.CHICKEN]: 1,   // Chicken moves slowly
    [ANIMAL_TYPES.ROOSTER]: 1,   // Rooster moves slowly
    [ANIMAL_TYPES.WOLF]: 3,      // Wolf moves fast
    [ANIMAL_TYPES.LION]: 4,      // Lion moves fastest
    [HUNTER_TYPE]: 1             // Hunter moves slowly but strategically
};

// ==================== HELPER FUNCTIONS ====================
// Functions: Reusable code blocks
// Each function performs a specific task and returns a result

/**
 * Random Position Generator
 * Generates a random coordinate in the simulation area (500x500)
 * 
 * EXPLANATION: function keyword defines a function
 * () contains parameters - this function takes no parameters
 * {} contains the function's operations
 * return = the value the function returns
 * 
 * @returns {number} Random number between 0-499
 */
export function getRandomPosition() {
    // Math.random() = generates random decimal number between 0 and 1 (e.g. 0.7234)
    // Math.random() * 500 = decimal number between 0 and 500 (e.g. 361.7)
    // Math.floor() = rounds decimal down (e.g. 361.7 -> 361)
    // Result: integer between 0-499
    return Math.floor(Math.random() * 500); // Position 0-499 (500x500 area)
}

/**
 * Random Gender Generator
 * Determines male or female gender with 50-50 chance
 * 
 * EXPLANATION: Using ternary operator (conditional operator)
 * condition ? if_true : if_false
 * 
 * @returns {string} 'male' or 'female' value
 */
export function getRandomGender() {
    // Math.random() < 0.5 = 50% chance true, 50% chance false
    // ? marks start of conditional operator
    // returns 'male' if true, 'female' if false
    return Math.random() < 0.5 ? 'male' : 'female';
}

/**
 * Distance Calculator Between Two Points
 * Uses Manhattan distance (|x1-x2| + |y1-y2|)
 * This calculation is preferred for performance in simulation
 * 
 * EXPLANATION: Function parameters
 * (a, b) = This function takes 2 parameters: a and b
 * a and b must be objects with x, y properties
 * Math.abs() = Takes absolute value (makes negative numbers positive)
 * 
 * @param {Object} a - First object (with x, y coordinates)
 * @param {Object} b - Second object (with x, y coordinates)
 * @returns {number} Distance between two points
 */
export function calculateDistance(a, b) {
    // a.x = x property of object a
    // b.x = x property of object b
    // Math.abs(a.x - b.x) = Absolute value of difference between X coordinates
    // Math.abs(a.y - b.y) = Absolute value of difference between Y coordinates
    // + adds them together (Manhattan distance)
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// ==================== CLASSES ====================
// CLASS: Defines the template for objects
// We can create new objects (instances) from classes

/**
 * Animal Class - Defines the basic properties of all animals
 * This class is used for all animal types in the simulation
 * 
 * EXPLANATION: Class is like a template
 * We can create as many animal objects as we want from this template
 * Each animal will have its own x, y, energy values
 */
export class Animal {
    /**
     * Creates a new animal (Constructor function)
     * EXPLANATION: constructor is a special function
     * It runs automatically when a new object is created
     * This runs when new Animal() is called
     * 
     * @param {string} type - Animal type (one from ANIMAL_TYPES)
     * @param {string} gender - Animal gender ('male' or 'female')
     * @param {number} x - X coordinate (0-499 range)
     * @param {number} y - Y coordinate (0-499 range)
     */
    constructor(type, gender, x, y) {
        // this = This object (the created animal object)
        // this.type = The type property of this object
        // Assigning incoming parameters to object properties
        this.type = type;               // Animal type - from external parameter
        this.gender = gender;           // Animal gender - from external parameter
        this.x = x;                     // X position - from external parameter
        this.y = y;                     // Y position - from external parameter
        this.energy = 100;              // Starting energy (fixed value - every animal starts with 100)
        this.alive = true;              // Life status (boolean - true/false)
    }

    /**
     * Animal movement function
     * Each animal type moves randomly in its own speed
     * Uses energy during movement and checks boundaries
     * 
     * EXPLANATION: Function inside a class (method)
     * This function can only be called by animal objects
     * 
     * @param {Object} hunter - Hunter object (currently unused)
     * @param {Array} animals - List of other animals (currently unused)
     */
    move(hunter, animals) {
        // Get movement distance based on this animal's type
        // MOVEMENT_DISTANCES[this.type] = Speed defined for this animal's type
        const movementDistance = MOVEMENT_DISTANCES[this.type];
        
        // Define 4 basic directions (right, down, left, up)
        // Array - stores values in list format inside []
        const dx = [0, 1, 0, -1];  // X direction changes (right=+1, left=-1, vertical=0)
        const dy = [1, 0, -1, 0];  // Y direction changes (down=+1, up=-1, horizontal=0)
        
        // Randomly select one of 0, 1, 2, or 3
        const direction = Math.floor(Math.random() * 4);  // Random direction (0-3)
        
        // Move the specified distance in the selected direction
        // dx[direction] = X change in selected direction
        // dy[direction] = Y change in selected direction
        // Math.max(0, ...) = Don't go below 0
        // Math.min(499, ...) = Don't go above 499
        this.x = Math.max(0, Math.min(499, this.x + dx[direction] * movementDistance));
        this.y = Math.max(0, Math.min(499, this.y + dy[direction] * movementDistance));
        
        // Energy decreases very slowly (1 energy every 10 moves)
        // This is necessary for a balanced ecosystem
        // Math.random() < 0.1 = 10% chance of true
        if (Math.random() < 0.1) {
            // Math.max(0, ...) = Energy shouldn't go below 0
            this.energy = Math.max(0, this.energy - 1);
        }
        
        // Animal dies when energy runs out
        // === strict equality check (type and value must be same)
        if (this.energy === 0) this.alive = false;
    }
}

/**
 * Hunter Class - Represents the human hunter
 * A special character that can hunt animals
 * 
 * EXPLANATION: This is also a class but different from Animal class
 * Hunter has its own special properties
 */
export class Hunter {
    /**
     * Creates a new hunter
     * EXPLANATION: Hunter constructor is simpler - only takes position
     * 
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    constructor(x, y) {
        this.x = x;                  // X position - from external input
        this.y = y;                  // Y position - from external input
        this.visionRange = 8;        // Hunter can see and hunt animals within 8 units
    }

    /**
     * Hunter movement function
     * Hunter moves slowly but strategically
     * 
     * EXPLANATION: Similar to animal movement function but simpler
     * Hunter takes no parameters because it doesn't depend on anything else
     */
    move() {
        // Hunter moves 1 unit (strategic movement)
        const dx = [0, 1, 0, -1];  // Direction changes (same logic)
        const dy = [1, 0, -1, 0];
        const direction = Math.floor(Math.random() * 4);  // Random direction (0-3)
        
        // Move within boundaries
        // MOVEMENT_DISTANCES[HUNTER_TYPE] = Hunter's movement speed (1)
        this.x = Math.max(0, Math.min(499, this.x + dx[direction] * MOVEMENT_DISTANCES[HUNTER_TYPE]));
        this.y = Math.max(0, Math.min(499, this.y + dy[direction] * MOVEMENT_DISTANCES[HUNTER_TYPE]));
    }
}

// ==================== STATISTICS ====================
// Global variables: Accessible from anywhere in the file

/**
 * Simulation statistics - Global variables
 * These variables track various events throughout the simulation
 * 
 * EXPLANATION: Variable declaration with let
 * let = Mutable variable (unlike const)
 * These numbers will increase during simulation
 */
let bornCount = 0;        // Total number of animals born - starts from 0
let hunterKillCount = 0;  // Number of animals killed by hunter - starts from 0
let lionKillCount = 0;    // Number of animals killed by lions - starts from 0
let wolfKillCount = 0;    // Number of animals killed by wolves - starts from 0

/**
 * Function that returns statistics
 * Used at the end of simulation or for interim reports
 * 
 * EXPLANATION: This function takes no parameters but returns an object
 * Creates object with key: value format inside {}
 * 
 * @returns {Object} Object containing all statistics
 */
export function getStats() {
    // Object return - returns multiple values at once
    return { 
        bornCount,           // bornCount: bornCount same as (ES6 shorthand)
        hunterKillCount,     // hunterKillCount: hunterKillCount same as
        lionKillCount,       // lionKillCount: lionKillCount same as
        wolfKillCount        // wolfKillCount: wolfKillCount same as
    };
}

/**
 * Function that resets statistics
 * Used when starting a new simulation
 * 
 * EXPLANATION: This function resets global variables to 0
 * For a clean start when beginning new simulation
 */
export function resetStats() {
    // Set global variables to 0
    bornCount = 0;           // = assignment operator (give new value)
    hunterKillCount = 0;
    lionKillCount = 0;
    wolfKillCount = 0;
}

// ==================== INITIAL POPULATION ====================
// Population: Determines how many animals there will be at the start

/**
 * Function that creates the initial animal population
 * Creates specific numbers of various animal types for a balanced ecosystem
 * 
 * EXPLANATION: This function returns an Array
 * Array will contain Animal objects
 * [] = Empty array, elements added with push()
 * 
 * @returns {Array} Array of initial animals
 */
export function initializeAnimals() {
    // Create empty array - we'll add animals here
    const animals = []; // [] = empty array
    
    // SHEEP - Herbivores, basic food source (15 pairs = 30 animals)
    // for loop - repeats a specific number of times
    // for (start; condition; increment) - start from i=0, continue while i<15, increment i by 1 each time
    for (let i = 0; i < 15; i++) {
        // Create equal numbers of male and female of each type
        // new Animal() = Create new animal object
        // push() = Add new element to Array
        animals.push(new Animal(ANIMAL_TYPES.SHEEP, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.SHEEP, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    // COWS - Herbivores, large animals (5 pairs = 10 animals)
    for (let i = 0; i < 5; i++) {
        animals.push(new Animal(ANIMAL_TYPES.COW, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.COW, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    // CHICKENS - Omnivores, small animals (female only, 10 animals)
    for (let i = 0; i < 10; i++) {
        animals.push(new Animal(ANIMAL_TYPES.CHICKEN, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    // ROOSTERS - Omnivores, small animals (male only, 10 animals)
    for (let i = 0; i < 10; i++) {
        animals.push(new Animal(ANIMAL_TYPES.ROOSTER, 'male', getRandomPosition(), getRandomPosition()));
    }
    
    // WOLVES - Carnivore predators (5 pairs = 10 animals)
    for (let i = 0; i < 5; i++) {
        animals.push(new Animal(ANIMAL_TYPES.WOLF, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.WOLF, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    // LIONS - Strongest predators (4 pairs = 8 animals)
    for (let i = 0; i < 4; i++) {
        animals.push(new Animal(ANIMAL_TYPES.LION, 'male', getRandomPosition(), getRandomPosition()));
        animals.push(new Animal(ANIMAL_TYPES.LION, 'female', getRandomPosition(), getRandomPosition()));
    }
    
    // Return the created animals array
    return animals;
}

// ==================== DISASTER/DISEASE CONTROL ====================
// Population control: Triggers disease if too many animals

/**
 * Disaster/disease system for population control
 * Automatically triggers disease if any species becomes overpopulated
 * This system is critical for maintaining ecosystem balance
 * 
 * EXPLANATION: This function monitors animal counts
 * If a species becomes too numerous, it kills some (disease simulation)
 * 
 * @param {Array} animals - Current list of animals
 */
export function applyDisasterIfNeeded(animals) {
    // Count how many animals of each type exist
    // {} = Create empty object, will store counts here
    const typeCounts = {};
    
    // forEach = Run function for each element in Array
    // (animal) => { } = Arrow function - short way of writing functions
    animals.forEach(animal => {
        // If we haven't counted this type before, start with 0
        // ! = Not operator, returns true if typeCounts[animal.type] doesn't exist
        if (!typeCounts[animal.type]) typeCounts[animal.type] = 0;
        
        // If animal is alive, increment count by 1
        // ++ = increment by 1 operator
        if (animal.alive) typeCounts[animal.type]++;
    });
    
    // Check each type
    // Object.entries() = Converts object to [key, value] pairs
    // forEach loops through each pair
    Object.entries(typeCounts).forEach(([type, count]) => {
        // Disaster triggers when over 100
        // > = Greater than comparison
        if (count > 100) {
            // Console.log = Print message to console (inform user)
            // Template literal - use ${variable} inside `` to include variables
            console.log(`⚠️ DISASTER/DISEASE: ${type} population at critical level (${count}), 20% got sick!`);
            
            let killedCount = 0;  // Count how many animals were killed
            // Math.floor = Round down, count * 0.2 = 20% of them
            const killTarget = Math.floor(count * 0.2); // Kill 20%
            
            // Randomly kill animals from disease
            animals.forEach(animal => {
                // && = And operator, all conditions must be true
                // < = Less than comparison
                if (animal.type === type && animal.alive && killedCount < killTarget && Math.random() < 0.25) {
                    animal.alive = false;  // Kill the animal
                    killedCount++;         // Increment counter
                }
            });
            
            console.log(`💀 ${killedCount} ${type} got sick and died.`);
        }
    });
}

// ==================== HUNTING AND MATING ====================
// Hunting and Mating: The most important parts of the simulation

/**
 * Main function that manages hunting and mating systems
 * This function is the most critical part of the simulation and performs:
 * 1. Hunter hunting
 * 2. Lion hunting
 * 3. Wolf hunting  
 * 4. Mating processes
 * 
 * EXPLANATION: This function is very complex but I'll explain step by step
 * Each section does a different job
 * 
 * @param {Array} animals - Current list of animals
 * @param {Object} hunter - Hunter object
 * @returns {Array} Updated list of animals (dead removed, newborns added)
 */
export function huntAndMate(animals, hunter) {
    let newAnimals = [];           // List of newborn animals - starts empty
    let huntedIndices = new Set(); // Indices of hunted animals - Set = No duplicates list
    
    // ========== HUNTER HUNTING ==========
    // Hunter searches for the closest animal and hunts with certain chance
    
    // Start with distance farther than hunter's vision range
    let shortestDistance = hunter.visionRange + 1;  // Start from vision range (9)
    let closestIndex = -1;                          // -1 = No animal found yet
    
    // Check all animals and find the closest one
    // forEach checks each animal, (animal, i) = animal object and index number
    animals.forEach((animal, i) => {
        // Skip dead animals - return = exit function
        if (!animal.alive) return; // Skip dead animals
        
        // Calculate distance between this animal and hunter
        const distance = calculateDistance(hunter, animal);
        
        // <= = Less than or equal, && = And operator
        // Must be both within vision range and closest so far
        if (distance <= hunter.visionRange && distance < shortestDistance) {
            shortestDistance = distance;    // New shortest distance
            closestIndex = i;               // This animal's index number
        }
    });
    
    // Hunt the closest animal with 30% chance
    // !== = Not equal comparison
    // Math.random() < 0.3 = 30% chance
    if (closestIndex !== -1 && Math.random() < 0.3) {
        animals[closestIndex].alive = false;    // Kill that animal
        huntedIndices.add(closestIndex);        // Add to Set (hunted marker)
        hunterKillCount++;                      // Increment statistics
    }
    
    // ========== LION HUNTING ==========
    // Lions hunt sheep and cows
    
    // Nested forEach loop - check all animals for each lion
    // Outer loop: Go through all animals (looking for lions)
    animals.forEach((animal, i) => {
        if (!animal.alive) return; // Skip dead animals
        
        // Is this animal a lion?
        if (animal.type === ANIMAL_TYPES.LION) {
            // Inner loop: Check all potential prey for this lion
            animals.forEach((prey, j) => {
                // Skip invalid situations:
                // - Skip if prey is dead
                // - Skip if it's itself (i === j)
                // - Skip if already hunted
                if (!prey.alive || i === j || huntedIndices.has(j)) return;
                
                // Lions only hunt sheep and cows
                // || = Or operator
                // <= = Less than or equal comparison
                if ((prey.type === ANIMAL_TYPES.SHEEP || prey.type === ANIMAL_TYPES.COW) && 
                    calculateDistance(animal, prey) <= HUNTING_DISTANCES[ANIMAL_TYPES.LION]) {
                    
                    // Hunt with 50% chance
                    if (Math.random() < 0.5) {
                        prey.alive = false;              // Kill prey
                        huntedIndices.add(j);            // Mark as hunted
                        animal.energy += 5;              // Hunter lion gains energy
                        lionKillCount++;                 // Increment statistics
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