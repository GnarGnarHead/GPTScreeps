const harvester = require('./harvester');
const upgrader = require('./upgrader');
const builder = require('./builder');
const hauler = require('./hauler');
const defender = require('./defender');
const towers = require('./towers');
const claimer = require('./claimer');
const repairer = require('./repairer');

// Constants to define desired numbers of each creep role
const HARVESTER_COUNT = 2;
const UPGRADER_COUNT = 1;
const BUILDER_COUNT = 1;
const HAULER_COUNT = 2;
const DEFENDER_COUNT = 1;
const CLAIMER_COUNT = 1;
const REPAIRER_COUNT = 1;

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
    const defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'defender');
    const claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');
    const repairers = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer');

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
        } else if (defenders.length < DEFENDER_COUNT) {
            spawnCreep('defender');
        } else if (claimers.length < CLAIMER_COUNT) {
            spawnCreep('claimer');
        } else if (repairers.length < REPAIRER_COUNT) {
            spawnCreep('repairer');
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
        if (creep.memory.role === 'harvester') {
            harvester.run(creep);
        } else if (creep.memory.role === 'upgrader') {
            upgrader.run(creep);
        } else if (creep.memory.role === 'builder') {
            builder.run(creep);
        } else if (creep.memory.role === 'hauler') {
            hauler.run(creep);
        } else if (creep.memory.role === 'defender') {
            defender.run(creep);
        } else if (creep.memory.role === 'claimer') {
            claimer.run(creep);
        } else if (creep.memory.role === 'repairer') {
            repairer.run(creep);
        }
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
    let body;
    if (role === 'hauler') {
        body = [CARRY, CARRY, MOVE, MOVE];
    } else if (role === 'builder' || role === 'upgrader') {
        body = [WORK, CARRY, MOVE];
    } else if (role === 'defender') {
        body = [TOUGH, ATTACK, MOVE, MOVE];
    } else if (role === 'claimer') {
        body = [CLAIM, MOVE];
    } else if (role === 'repairer') {
        body = [WORK, CARRY, MOVE];
    } else {
        body = [WORK, WORK, CARRY, MOVE]; // Example for harvester
    }

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
