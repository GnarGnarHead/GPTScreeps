const { manageConstructionAndRepairs } = require('construction');
const { getPath } = require('cache');

function run(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🚧 work');
    }

    // Emergency defense logic
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        } else if (creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        }
        return; // Skip other tasks if defending
    }

    if (creep.memory.working) {
        if (creep.room.name === Game.spawns['Spawn1'].room.name) {
            manageConstructionAndRepairs(creep);
        } else {
            // Return to home room if working
            let exitDir = creep.room.findExitTo(Game.spawns['Spawn1'].room.name);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            const path = getPath(creep.pos, source.pos);
            creep.moveByPath(path);
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
        if (creep.room.name !== targetRoomName) {
            let exitDir = creep.room.findExitTo(targetRoomName);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        if (creep.room.name !== Game.spawns['Spawn1'].room.name) {
            let exitDir = creep.room.findExitTo(Game.spawns['Spawn1'].room.name);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
        } else {
            let storage = Game.spawns['Spawn1'].pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                        structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_STORAGE) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (storage && creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

module.exports = { run };
