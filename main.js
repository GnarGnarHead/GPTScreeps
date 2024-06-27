const harvester = require('./harvester');
const upgrader = require('./upgrader');
const builder = require('./builder');

// Constants for desired number of each type of creep
const HARVESTER_COUNT = 2;
const UPGRADER_COUNT = 1;
const BUILDER_COUNT = 1;

// Main game loop
module.exports.loop = function () {
    // Clear memory of dead creeps
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Creep spawning logic
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');

    if(harvesters.length < HARVESTER_COUNT) {
        spawnCreep('harvester');
    }
    if(upgraders.length < UPGRADER_COUNT) {
        spawnCreep('upgrader');
    }
    if(builders.length < BUILDER_COUNT) {
        spawnCreep('builder');
    }

    // Assign tasks based on role
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role === 'harvester') {
            harvester.run(creep);
        } else if(creep.memory.role === 'upgrader') {
            upgrader.run(creep);
        } else if(creep.memory.role === 'builder') {
            builder.run(creep);
        }
    }
};

// Function to spawn creeps
function spawnCreep(role) {
    let body = [WORK, CARRY, MOVE];
    let newName = role.charAt(0).toUpperCase() + role.slice(1) + Game.time;
    let spawnName = Game.spawns['Spawn1'];

    if(spawnName && spawnName.spawnCreep(body, newName, {memory: {role: role, working: false}}) === OK) {
        console.log('Spawning new ' + role + ': ' + newName);
    } else {
        console.log('Error spawning ' + role);
    }
}
