const worker = require('./worker');
const defender = require('./defender');
const claimer = require('./claimer');
const towers = require('./towers');

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

    assignTasks();

    const towersArray = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
    for (let t of towersArray) {
        towers.run(t);
    }
};

function assignTasks() {
    const tasks = [];
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role === 'worker') {
            tasks.push({ creep: creep, priority: getTaskPriority(creep) });
        } else if (creep.memory.role === 'defender') {
            defender.run(creep);
        } else if (creep.memory.role === 'claimer') {
            claimer.run(creep);
        }
    }

    tasks.sort((a, b) => a.priority - b.priority);
    tasks.forEach(task => worker.run(task.creep));
}

function getTaskPriority(creep) {
    if (creep.memory.working) {
        let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionSite) {
            return 1; // Building
        }
        let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (structure) {
            return 2; // Repairing
        }
        let controller = creep.room.controller;
        if (controller) {
            return 3; // Upgrading
        }
    }
    if (creep.store.getFreeCapacity() > 0) {
        return 4; // Harvesting
    }
    return 5; // Remote Mining
}

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
        console.log('Not enough energy to spawn ' + role + '. Available: ' + energyAvailable + ', Required: ' + energyRequired);
    }
}
