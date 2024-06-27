/**
 * Hauler Module
 * 
 * This module defines the behavior of hauler creeps.
 * Haulers collect energy from sources, containers, or dropped resources and transfer it to spawns, extensions, and storage.
 * When not needed for primary tasks, haulers assist in upgrading and building.
 */

function runHauler(creep) {
    if (creep.store[RESOURCE_ENERGY] === 0) {
        let source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER ||
                                    structure.structureType === STRUCTURE_STORAGE) &&
                                    structure.store[RESOURCE_ENERGY] > 0
        });

        if (!source) {
            source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
                filter: (resource) => resource.resourceType === RESOURCE_ENERGY
            });
        }

        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE || creep.pickup(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            console.log(`${creep.name} could not find a source to withdraw from.`);
        }
    } else {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                    structure.structureType === STRUCTURE_EXTENSION ||
                                    structure.structureType === STRUCTURE_TOWER ||
                                    structure.structureType === STRUCTURE_STORAGE) &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            assistWithOtherTasks(creep);
        }
    }
}

function assistWithOtherTasks(creep) {
    let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (constructionSite) {
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
        });
        if (repairTarget) {
            if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

module.exports = { run: runHauler };
