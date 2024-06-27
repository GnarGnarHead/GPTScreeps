const { manageConstructionAndRepairs } = require('construction');
const { moveTo, say } = require('movement');

function handleResourceState(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        say(creep, '🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        say(creep, '🚧 work');
    }
}

function run(creep) {
    handleResourceState(creep);

    // Emergency defense logic
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        say(creep, '⚔️ defend');
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE || creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
            moveTo(creep, hostile);
        }
        return;
    }

    if (creep.memory.working) {
        if (creep.room.name === Game.spawns['Spawn1'].room.name) {
            manageConstructionAndRepairs(creep);
        } else {
            say(creep, '🚶 return');
            moveTo(creep, creep.pos.findClosestByRange(creep.room.findExitTo(Game.spawns['Spawn1'].room.name)));
        }
    } else {
        say(creep, '⛏️ harvest');
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
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
        say(creep, '🌍 remote');
        if (creep.room.name !== targetRoomName) {
            moveTo(creep, creep.pos.findClosestByRange(creep.room.findExitTo(targetRoomName)));
        } else {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                moveTo(creep, source);
            }
        }
    } else {
        say(creep, '🔄 return');
        if (creep.room.name !== Game.spawns['Spawn1'].room.name) {
            moveTo(creep, creep.pos.findClosestByRange(creep.room.findExitTo(Game.spawns['Spawn1'].room.name)));
        } else {
            const storage = Game.spawns['Spawn1'].pos.findClosestByPath(FIND_STRUCTURES, {
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
