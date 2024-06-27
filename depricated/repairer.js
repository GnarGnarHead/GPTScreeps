/**
 * Repairer Module
 * 
 * This module defines the behavior of repairer creeps.
 * The primary function of a repairer is to repair damaged structures.
 */

function runRepairer(creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    } else {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });

        if (target && creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
}

module.exports = { run: runRepairer };
