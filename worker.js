const { moveTo, say, moveToRandomNearbyPos } = require('movement');

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

function manageConstructionAndRepairs(creep) {
    const criticalRepairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax * 0.5
    });
    if (criticalRepairTarget) {
        say(creep, '🔧 repair');
        if (creep.repair(criticalRepairTarget) === ERR_NOT_IN_RANGE) {
            moveTo(creep, criticalRepairTarget);
        }
        return;
    }

    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
        say(creep, '🚧 build');
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            moveTo(creep, target);
        }
        return;
    }

    const repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if (repairTarget) {
        say(creep, '🔨 repair');
        if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
            moveTo(creep, repairTarget);
        }
        return;
    }

    const controller = creep.room.controller;
    if (controller) {
        say(creep, '⚡ upgrade');
        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            moveTo(creep, controller);
        }
    }
}

function harvestAndTransport(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES_ACTIVE);
        if (sources.length > 0) {
            const source = creep.pos.findClosestByPath(sources, {
                filter: (source) => source.energy > 0 && creep.room.lookForAt(LOOK_CREEPS, source.pos).length < 2
            });
            if (source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    moveToRandomNearbyPos(creep, source);
                }
            }
        }
    } else {
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER ||
                                    structure.structureType === STRUCTURE_STORAGE ||
                                    structure.structureType === STRUCTURE_SPAWN ||
                                    structure.structureType === STRUCTURE_EXTENSION) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        if (target && creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            moveTo(creep, target);
        }
    }
}

module.exports = { run };
