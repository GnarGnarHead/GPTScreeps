const { getPath } = require('cache');
const { moveTo } = require('movement');

function manageConstructionAndRepairs(creep) {
    if (creep.memory.working) {
        // Critical repairs first (decaying structures like containers and roads)
        let criticalRepairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax * 0.5
        });
        if (criticalRepairTarget) {
            creep.say('🔧 repair');
            if (creep.repair(criticalRepairTarget) === ERR_NOT_IN_RANGE) {
                moveTo(creep, criticalRepairTarget);
            }
            return;
        }

        // Then construction
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            creep.say('🚧 build');
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                moveTo(creep, target);
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
                moveTo(creep, repairTarget);
            }
            return;
        }

        // Finally, upgrade the controller
        let controller = creep.room.controller;
        if (controller) {
            creep.say('⚡ upgrade');
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                moveTo(creep, controller);
            }
        }
    }
}

module.exports = { manageConstructionAndRepairs };
