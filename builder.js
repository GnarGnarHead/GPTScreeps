/**
 * Builder Module
 * 
 * This module defines the behavior of builder creeps.
 * Builders construct buildings and repair structures when there are no construction sites.
 */

function runBuilder(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🚧 build');
    }

    if (creep.memory.working) {
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
            filter: (site) => site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_EXTENSION
        });

        if (!target) {
            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        }

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
            }
        }
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
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

module.exports = { run: runBuilder };
