/**
 * Worker Module
 * 
 * This module defines the behavior of worker creeps.
 * Workers handle harvesting, upgrading, building, hauling, repairing tasks,
 * assist in defense during emergencies, and perform remote mining if needed.
 */

function runWorker(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🚧 work');
    }

    // Emergency defense logic
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        } else if (creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        }
        return; // Skip other tasks if defending
    }

    // Regular tasks
    if (creep.memory.working) {
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            createConstructionSites(creep.room);
            let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if (repairTarget && creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffaa00' } });
            } else {
                let controller = creep.room.controller;
                if (controller && creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }

    // Remote mining
    if (!creep.memory.working) {
        runRemoteMining(creep);
    }
}

function runRemoteMining(creep) {
    const targetRoomName = 'W8N3'; // Set your target remote room
    if (creep.room.name !== targetRoomName) {
        let exitDir = creep.room.findExitTo(targetRoomName);
        let exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else if (creep.store.getFreeCapacity() === 0) {
            let home = Game.spawns['Spawn1'];
            creep.moveTo(home, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
}

/**
 * Function to create construction sites for containers and extensions if needed
 *
 * @param {Room} room - The room to create the construction site in.
 */
function createConstructionSites(room) {
    const extensionCount = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_EXTENSION && structure.room.name === room.name).length;
    const extensionSitesCount = _.filter(Game.constructionSites, (site) => site.structureType === STRUCTURE_EXTENSION && site.room.name === room.name).length;
    const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];

    const containerCount = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.room.name === room.name).length;
    const containerSitesCount = _.filter(Game.constructionSites, (site) => site.structureType === STRUCTURE_CONTAINER && site.room.name === room.name).length;
    const maxContainers = CONTROLLER_STRUCTURES[STRUCTURE_CONTAINER][room.controller.level];

    if (extensionCount + extensionSitesCount < maxExtensions) {
        for (let x = room.controller.pos.x - 5; x <= room.controller.pos.x + 5; x++) {
            for (let y = room.controller.pos.y - 5; y <= room.controller.pos.y + 5; y++) {
                if (room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                    return true;
                }
            }
        }
    }

    if (containerCount + containerSitesCount < maxContainers) {
        for (let x = room.controller.pos.x - 5; x <= room.controller.pos.x + 5; x++) {
            for (let y = room.controller.pos.y - 5; y <= room.controller.pos.y + 5; y++) {
                if (room.createConstructionSite(x, y, STRUCTURE_CONTAINER) === OK) {
                    return true;
                }
            }
        }
    }

    return false;
}

module.exports = { run: runWorker };
