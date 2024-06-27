const { getPath } = require('cache');

function manageConstructionAndRepairs(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🚧 work');
    }

    if (creep.memory.working) {
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, target.pos);
                creep.moveByPath(path);
            }
        } else {
            let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if (repairTarget) {
                if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                    const path = getPath(creep.pos, repairTarget.pos);
                    creep.moveByPath(path);
                }
            } else {
                let controller = creep.room.controller;
                if (controller && creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    const path = getPath(creep.pos, controller.pos);
                    creep.moveByPath(path);
                }
            }
        }
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            const path = getPath(creep.pos, source.pos);
            creep.moveByPath(path);
        }
    }
}

module.exports = { manageConstructionAndRepairs };
