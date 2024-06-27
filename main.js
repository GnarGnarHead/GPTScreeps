const harvester = require('./harvester');
const upgrader = require('./upgrader');
const builder = require('./builder');
const hauler = require('./hauler');

// Constants to define desired numbers of each creep role
const HARVESTER_COUNT = 2;
const UPGRADER_COUNT = 1;
const BUILDER_COUNT = 1;
const HAULER_COUNT = 2;

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
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler');

    // Check if there is enough energy to spawn a new creep
    if (Game.spawns['Spawn1'].room.energyAvailable >= MINIMUM_ENERGY_RESERVE) {
        if (harvesters.length < HARVESTER_COUNT) {
            spawnCreep('harvester');
        } else if (haulers.length < HAULER_COUNT) {
            spawnCreep('hauler');
        } else if (upgraders.length < UPGRADER_COUNT) {
            spawnCreep('upgrader');
        } else if (builders.length < BUILDER_COUNT) {
            spawnCreep('builder');
        }
    }

    // Assign tasks to creeps based on their roles
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'harvester') {
            harvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            upgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            builder.run(creep);
        } else if (creep.memory.role === 'hauler') {
            hauler.run(creep);
        }
    }
};

/**
 * Function to spawn creeps based on role.
 * Ensures sufficient energy is available before spawning.
 * Logs appropriate messages based on success or failure.
 *
 * @param {string} role - The role of the creep to be spawned.
 */
function spawnCreep(role) {
    let body;
    if (role === 'hauler') {
        body = [CARRY, CARRY, MOVE, MOVE];
    } else if (role === 'builder' || role === 'upgrader') {
        body = [WORK, CARRY, MOVE];
    } else {
        body = [WORK, WORK, CARRY, MOVE]; // Example for harvester
    }

    let newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
    let spawnName = Game.spawns['Spawn1'];
    let result = spawnName.spawnCreep(body, newName, { memory: { role: role, working: false } });

    if (result === OK) {
        console.log('Spawning new ' + role + ': ' + newName);
    } else {
        console.log('Error spawning ' + role + ': ' + result);
    }
}
