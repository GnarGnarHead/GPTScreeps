const { getPath } = require('cache');

function manageConstructionAndRepairs(creep) {
    if (creep.memory.working) {
        // Critical repairs first
        let criticalRepairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax * 0.5 && (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_ROAD)
        });
        if (criticalRepairTarget) {
            if (creep.repair(criticalRepairTarget) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, criticalRepairTarget.pos);
                creep.moveByPath(path);
            }
            return;
        }

        // Then construction
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, target.pos);
                creep.moveByPath(path);
            }
            return;
        }

        // General repairs
        let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (repairTarget) {
            if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, repairTarget.pos);
                creep.moveByPath(path);
            }
            return;
        }

        // Finally, upgrade the controller
        let controller = creep.room.controller;
        if (controller && creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            const path = getPath(creep.pos, controller.pos);
            creep.moveByPath(path);
        }
    }
}

module.exports = { manageConstructionAndRepairs };
