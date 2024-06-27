/**
 * Hauler Module
 * 
 * This module defines the behavior of hauler creeps.
 * Haulers collect energy from sources, containers, storage, dropped resources, or directly from harvesters and transfer it to spawns, extensions, and storage.
 * When not needed for primary tasks, haulers assist in upgrading, building, and delivering energy to builders.
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

        if (!source) {
            source = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: (otherCreep) => otherCreep.memory.role === 'harvester' && otherCreep.store[RESOURCE_ENERGY] > 0
            });
        }

        if (source) {
            if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE || creep.pickup(source) === ERR_NOT_IN_RANGE || creep.harvest(source) === ERR_NOT_IN_RANGE) {
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
            console.log(`${creep.name} could not find a target to transfer energy to. Engaging in secondary tasks.`);
            assistWithOtherTasks(creep);
        }
    }
}

function assistWithOtherTasks(creep) {
    let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (constructionSite) {
        console.log(`${creep.name} found a construction site: ${constructionSite.structureType}`);
        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        console.log(`${creep.name} found no construction sites. Attempting to repair structures.`);
        let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
        });
        if (repairTarget) {
            console.log(`${creep.name} found a structure to repair: ${repairTarget.structureType}`);
            if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            console.log(`${creep.name} found no structures to repair. Upgrading controller.`);
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

module.exports = { run: runHauler };
