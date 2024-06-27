const { manageConstructionAndRepairs } = require('construction');
const { moveTo, say } = require('movement');

function run(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        say(creep, '🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        say(creep, '🚧 work');
    }

    if (creep.memory.working) {
        manageConstructionAndRepairs(creep);
    } else {
        harvestAndTransport(creep);
    }
}

function harvestAndTransport(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        // Harvest resources
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            moveTo(creep, source);
        }
    } else {
        // Transport resources to storage or structures
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                    structure.structureType === STRUCTURE_EXTENSION ||
                                    structure.structureType === STRUCTURE_STORAGE) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            moveTo(creep, target);
        }
    }
}

module.exports = { run };
