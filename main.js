const roleWorker = require('worker');
const roleDefender = require('defender');
const roleClaimer = require('claimer');
const { createOptimalConstructionSites } = require('construction');
const { manageResources } = require('resourceManager');

module.exports.loop = function () {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role === 'worker') {
            roleWorker.run(creep);
        } else if (creep.memory.role === 'defender') {
            roleDefender.run(creep);
        } else if (creep.memory.role === 'claimer') {
            roleClaimer.run(creep);
        }
    }

    const spawn = Game.spawns['Spawn1'];
    if (spawn) {
        const workerCount = _.filter(Game.creeps, creep => creep.memory.role === 'worker').length;
        const defenderCount = _.filter(Game.creeps, creep => creep.memory.role === 'defender').length;

        if (workerCount < 5) {
            spawn.spawnCreep([WORK, CARRY, MOVE], `Worker${Game.time}`, { memory: { role: 'worker' } });
        } else if (defenderCount < 2) {
            spawn.spawnCreep([ATTACK, MOVE], `Defender${Game.time}`, { memory: { role: 'defender' } });
        }
    }

    if (Game.time % 100 === 0) {
        for (const roomName in Game.rooms) {
            const room = Game.rooms[roomName];
            createOptimalConstructionSites(room);
            manageResources(room);
        }
    }
}
