const harvester = require('./harvester');
const upgrader = require('./upgrader');
const builder = require('./builder');
const hauler = require('./hauler');

const HARVESTER_COUNT = 2;
const UPGRADER_COUNT = 1;
const BUILDER_COUNT = 1;
const HAULER_COUNT = 2;

const MINIMUM_ENERGY_RESERVE = 300; // Adjust based on the minimum needed for the most critical creep

module.exports.loop = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const haulers = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler');

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
