const harvester = require('./harvester');
const upgrader = require('./upgrader');
const builder = require('./builder');
const hauler = require('./hauler');

const HARVESTER_COUNT = 2;
const UPGRADER_COUNT = 1;
const BUILDER_COUNT = 1;
const HAULER_COUNT = 2;

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

    if (harvesters.length < HARVESTER_COUNT) {
        spawnCreep('harvester');
    }
    if (upgraders.length < UPGRADER_COUNT) {
        spawnCreep('upgrader');
    }
    if (builders.length < BUILDER_COUNT) {
        spawnCreep('builder');
    }
    if (haulers.length < HAULER_COUNT) {
        spawnCreep('hauler');
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
        body = [CARRY, CARRY, MOVE, MOVE]; // Adjust the body parts based on your needs and available energy
    } else {
        body = [WORK, CARRY, MOVE];
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
