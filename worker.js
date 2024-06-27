const { getPath } = require('cache');

function run(creep) {
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
        if (creep.room.name === Game.spawns['Spawn1'].room.name) {
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    const path = getPath(creep.pos, target.pos);
                    creep.moveByPath(path);
                }
            } else {
                createConstructionSites(creep.room);
                let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax
                });
                if (repairTarget && creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                    const path = getPath(creep.pos, repairTarget.pos);
                    creep.moveByPath(path);
                } else {
                    let controller = creep.room.controller;
                    if (controller && creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                        const path = getPath(creep.pos, controller.pos);
                        creep.moveByPath(path);
                    }
                }
            }
        } else {
            // Return to home room if working
            let exitDir = creep.room.findExitTo(Game.spawns['Spawn1'].room.name);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            const path = getPath(creep.pos, source.pos);
            creep.moveByPath(path);
        } else {
            runRemoteMining(creep);
        }
    }
}

function runRemoteMining(creep) {
    const targetRoomName = 'W8N3'; // Replace with your target remote room
    if (creep.memory.remoteMining && creep.store.getFreeCapacity() === 0) {
        creep.memory.remoteMining = false;
    }
    if (!creep.memory.remoteMining && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.remoteMining = true;
    }

    if (creep.memory.remoteMining) {
        if (creep.room.name !== targetRoomName) {
            let exitDir = creep.room.findExitTo(targetRoomName);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    } else {
        if (creep.room.name !== Game.spawns['Spawn1'].room.name) {
            let exitDir = creep.room.findExitTo(Game.spawns['Spawn1'].room.name);
            let exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffffff' } });
        } else {
            let storage = Game.spawns['Spawn1'].pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_SPAWN ||
                                        structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_STORAGE) &&
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (storage && creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
    }
}

function createConstructionSites(room) {
    try {
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
    } catch (error) {
        console.log('Error in createConstructionSites:', error);
    }

    return false;
}

module.exports = { run };
