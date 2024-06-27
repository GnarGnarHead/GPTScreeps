const { manageConstructionAndRepairs } = require('construction');
const { moveTo, say } = require('movement');

function run(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        say(creep, '🔄 harvest', 3);
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        say(creep, '🚧 work', 3);
    }

    // Emergency defense logic
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        say(creep, '⚔️ defend', 3);
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
            moveTo(creep, hostile);
        } else if (creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
            moveTo(creep, hostile);
        }
        return; // Skip other tasks if defending
    }

    if (creep.memory.working) {
        if (creep.room.name === Game.spawns['Spawn1'].room.name) {
            manageConstructionAndRepairs(creep);
        } else {
            say(creep, '🚶 return', 3);
            // Return to home room if working
            let exitDir = creep.room.findExitTo(Game.spawns['Spawn1'].room.name);
            let exit = creep.pos.findClosestByRange(exitDir);
            moveTo(creep, exit);
        }
    } else {
        say(creep, '⛏️ harvest', 3);
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            moveTo(creep, source);
        } else {
            runRemoteMining(creep);
        }
    }
}

function runRemoteMining(creep) {
    const targetRoomName = 'W8N3'; // Replace with your target remote room

    if (creep.memory.remoteMining && creep.store.getFreeCapacity() === 0) {
        creep.memory.remoteMining = false;
    }
    if (!creep.memory.remoteMining && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.remoteMining = true;
    }

    if (creep.memory.remoteMining) {
        say(creep, '🌍 remote', 3);
        if (creep.room.name !== targetRoomName) {
            let exitDir = creep.room.findExitTo(targetRoomName);
            let exit = creep.pos.findClosestByRange(exitDir);
            moveTo(creep, exit);
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                moveTo(creep, source);
            }
        }
    } else {
        say(creep, '🔄 return', 3);
        if (creep.room.name !== Game.spawns['Spawn1'].room.name) {
            let exitDir = creep.room.findExitTo(Game.spawns['Spawn1'].room.name);
            let exit = creep.pos.findClosestByRange(exitDir);
            moveTo(creep, exit);
        } else {
            let storage = Game.spawns['Spawn1'].pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                        structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_STORAGE) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (storage && creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                moveTo(creep, storage);
            }
        }
    }
}

module.exports = { run };
