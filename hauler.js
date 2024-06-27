/**
 * Hauler Module
 * 
 * This module defines the behavior of hauler creeps.
 * Haulers collect energy from sources or containers and transfer it to spawns, extensions, and storage.
 */

function runHauler(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        let source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER ||
                                    structure.structureType === STRUCTURE_STORAGE) &&
                                    structure.store[RESOURCE_ENERGY] > 0
        });
        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            console.log(`${creep.name} could not find a source to withdraw from.`);
        }
    } else {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                    structure.structureType === STRUCTURE_EXTENSION ||
                                    structure.structureType === STRUCTURE_TOWER) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            console.log(`${creep.name} could not find a target to transfer energy to.`);
        }
    }
}

module.exports = { run: runHauler };
