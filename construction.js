const { getPath } = require('cache');

function manageConstructionAndRepairs(creep) {
    if (creep.memory.working) {
        // Critical repairs first (decaying structures like containers and roads)
        let criticalRepairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax * 0.5
        });
        if (criticalRepairTarget) {
            creep.say('🔧 repair');
            if (creep.repair(criticalRepairTarget) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, criticalRepairTarget.pos);
                creep.moveByPath(path, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            return;
        }

        // Then construction
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            creep.say('🚧 build');
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, target.pos);
                creep.moveByPath(path, { visualizePathStyle: { stroke: '#ffffff' } });
            }
            return;
        }

        // General repairs
        let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (repairTarget) {
            creep.say('🔨 repair');
            if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, repairTarget.pos);
                creep.moveByPath(path, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            return;
        }

        // Finally, upgrade the controller
        let controller = creep.room.controller;
        if (controller) {
            creep.say('⚡ upgrade');
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                const path = getPath(creep.pos, controller.pos);
                creep.moveByPath(path, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

module.exports = { manageConstructionAndRepairs };
