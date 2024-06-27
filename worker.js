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
        if (creep.memory.role === 'harvester') {
            harvestResources(creep);
        } else if (creep.memory.role === 'transporter') {
            transportResources(creep);
        }
    }
}

function harvestResources(creep) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        moveTo(creep, source);
    } else {
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                   structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (container && creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            moveTo(creep, container);
        }
    }
}

function transportResources(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_CONTAINER &&
                                   structure.store[RESOURCE_ENERGY] > 0
        });
        if (container && creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            moveTo(creep, container);
        }
    } else {
        const storage = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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

module.exports = { run };
