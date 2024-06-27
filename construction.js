const { moveTo, say } = require('movement');

function manageConstructionAndRepairs(creep) {
    if (!creep.memory.working) return;

    // Critical repairs first
    const criticalRepairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax * 0.5
    });
    if (criticalRepairTarget) {
        say(creep, '🔧 repair');
        if (creep.repair(criticalRepairTarget) === ERR_NOT_IN_RANGE) {
            moveTo(creep, criticalRepairTarget);
        }
        return;
    }

    // Construction
    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
        say(creep, '🚧 build');
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
            moveTo(creep, target);
        }
        return;
    }

    // General repairs
    const repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    });
    if (repairTarget) {
        say(creep, '🔨 repair');
        if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
            moveTo(creep, repairTarget);
        }
        return;
    }

    // Upgrade controller
    const controller = creep.room.controller;
    if (controller) {
        say(creep, '⚡ upgrade');
        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            moveTo(creep, controller);
        }
    }
}

function createOptimalConstructionSites(room) {
    const sources = room.find(FIND_SOURCES);
    const targetLocations = [room.controller.pos, room.storage ? room.storage.pos : Game.spawns['Spawn1'].pos];

    sources.forEach(source => {
        targetLocations.forEach(target => {
            const midpoint = new RoomPosition(
                Math.floor((source.pos.x + target.x) / 2),
                Math.floor((source.pos.y + target.y) / 2),
                room.name
            );
            room.createConstructionSite(midpoint, STRUCTURE_CONTAINER);
        });
    });
}

module.exports = { manageConstructionAndRepairs, createOptimalConstructionSites };
