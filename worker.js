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
        harvestAndHaul(creep);
    }
}

function harvestAndHaul(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        // Harvest resources
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            moveTo(creep, source);
        }
    } else {
        // Haul resources
        const nearestContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        if (nearestContainer) {
            if (creep.transfer(nearestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                moveTo(creep, nearestContainer);
            }
        } else {
            const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                        structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_STORAGE) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            if (storage) {
                if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    moveTo(creep, storage);
                }
            } else {
                const nextWorker = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                    filter: (c) => c.memory.role === 'worker' && c.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                });

                if (nextWorker) {
                    if (creep.transfer(nextWorker, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        moveTo(creep, nextWorker);
                    }
                }
            }
        }
    }
}

module.exports = { run };
