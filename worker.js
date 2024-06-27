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
        if (creep.memory.hauling) {
            haulResources(creep);
        } else {
            harvestResources(creep);
        }
    }
}

function harvestResources(creep) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        moveTo(creep, source);
    } else {
        // Drop off resources at the nearest container or storage
        const dropOff = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER ||
                                    structure.structureType === STRUCTURE_STORAGE) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (dropOff && creep.transfer(dropOff, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            moveTo(creep, dropOff);
        }
    }
}

function haulResources(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.hauling = false;
    } else {
        const dropOff = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                    structure.structureType === STRUCTURE_EXTENSION ||
                                    structure.structureType === STRUCTURE_STORAGE) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        if (dropOff && creep.transfer(dropOff, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            moveTo(creep, dropOff);
        }
    }
}

module.exports = { run };
