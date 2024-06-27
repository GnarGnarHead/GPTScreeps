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
    const claimers = _.filter(Game.creeps, (creep) => creep.memory.role === '
