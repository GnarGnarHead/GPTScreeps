const { getPath } = require('./cache');

function runWorker(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🚧 work');
    }

    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        } else if (creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        }
        return;
    }

    if (creep.memory.working) {
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
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            const path = getPath(creep.pos, source.pos);
            creep.moveByPath(path);
        }
    }

    if (!creep.memory.working) {
        runRemoteMining(creep);
    }
}

function runRemoteMining(creep) {
    const targetRoomName = 'W8N3';
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
