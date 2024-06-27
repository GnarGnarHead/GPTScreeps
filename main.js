const { assignTasks } = require('taskManager');
const towers = require('towers');

// Constants for creep counts
const WORKER_COUNT = 6;
const DEFENDER_COUNT = 2;
const CLAIMER_COUNT = 1;
const MINIMUM_ENERGY_RESERVE = 300;

module.exports.loop = function () {
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Spawn new creeps based on priorities
    const workers = _.filter(Game.creeps, (creep) => creep.memory.role === 'worker');
    const defenders = _.filter(Game.creeps, (creep) => creep.memory.role === 'defender');
    const claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer');

    if (Game.spawns['Spawn1'].room.energyAvailable >= MINIMUM_ENERGY_RESERVE) {
        if (workers.length < WORKER_COUNT) {
            spawnCreep('worker');
        } else if (defenders.length < DEFENDER_COUNT) {
            spawnCreep('defender');
        } else if (claimers.length < CLAIMER_COUNT) {
            spawnCreep('claimer');
        }
    }

    // Assign tasks to creeps
    try {
        assignTasks();
    } catch (error) {
        console.log('Error in assignTasks:', error);
    }

    // Tower logic
    try {
        const towersArray = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
        for (let t of towersArray) {
            towers.run(t);
        }
    } catch (error) {
        console.log('Error in tower logic:', error);
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
    if (role === 'worker') {
        body = [WORK, CARRY, MOVE];
    } else if (role === 'defender') {
        body = [TOUGH, ATTACK, MOVE, MOVE];
    } else if (role === 'claimer') {
        body = [CLAIM, MOVE];
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
        console.log('Not enough energy to spawn ' + role + '. Available: ' + energyAvailable + ', Required: ' + energyRequi
