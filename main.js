const worker = require('./worker');
const taskManager = require('./taskManager');

// Constants to define desired numbers of each creep role
const WORKER_COUNT = 10;

// Minimum energy reserve to ensure critical creeps can be spawned
const MINIMUM_ENERGY_RESERVE = 300;

/**
 * Main game loop function.
 * Clears memory of dead creeps, manages spawning based on defined priorities,
 * and assigns tasks to creeps based on their roles.
 */
module.exports.loop = function () {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Filter creeps by their roles
    const workers = _.filter(Game.creeps, (creep) => creep.memory.role === 'worker');

    // Check if there is enough energy to spawn a new creep
    if (Game.spawns['Spawn1'].room.energyAvailable >= MINIMUM_ENERGY_RESERVE) {
        if (workers.length < WORKER_COUNT) {
            spawnCreep('worker');
        }
    }

    // Assign tasks to creeps based on their roles
    assignTasks();

    // Tower logic
    const towersArray = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
    for (let t of towersArray) {
        towers.run(t);
    }
};

/**
 * Function to assign tasks to creeps based on their roles.
 */
function assignTasks() {
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        worker.run(creep);
    }
}

/**
 * Function to spawn creeps based on role.
 * Ensures sufficient energy is available before spawning.
 * Logs appropriate messages based on success or failure.
 *
 * @param {string} role - The role of the creep to be spawned.
 */
function spawnCreep(role) {
    let body = [WORK, CARRY, MOVE, MOVE];

    let newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
    let spawnName = Game.spawns['Spawn1'];
    let energyAvailable = spawnName.room.energyAvailable;
    let energyRequired = _.sum(body, part => BODYPART_COST[part]);

    if (energyAvailable >= energyRequired) {
        let result = spawnName.spawnCreep(body, newName, { memory: { role: role, working: false } });

        if (result === OK) {
            console.log('Spawning new ' + role + ': ' + newName);
        } else {
            console.log('Error spawning ' + role + ': ' + result);
        }
    } else {
        console.log('Not enough energy to spawn ' + role + '. Available: ' + energyAvailable + ', Required: ' + energyRequired);
    }
}
