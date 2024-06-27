const { moveTo, say } = require('movement');

function findAndAct(creep, findFunc, actionFunc, actionText, visualize = false) {
    const target = findFunc();
    if (target) {
        say(creep, actionText);
        if (actionFunc(target) === ERR_NOT_IN_RANGE) {
            moveTo(creep, target, visualize);
        }
        return true;
    }
    return false;
}

function manageConstructionAndRepairs(creep) {
    if (!creep.memory.working) return;

    // Critical repairs first
    if (findAndAct(
        creep,
        () => creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_ROAD) && structure.hits < structure.hitsMax * 0.5
        }),
        target => creep.repair(target),
        '🔧 repair'
    )) return;

    // Construction
    if (findAndAct(
        creep,
        () => creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES),
        target => creep.build(target),
        '🚧 build'
    )) return;

    // General repairs
    if (findAndAct(
        creep,
        () => creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        }),
        target => creep.repair(target),
        '🔨 repair'
    )) return;

    // Upgrade controller
    const controller = creep.room.controller;
    if (controller) {
        say(creep, '⚡ upgrade');
        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            moveTo(creep, controller);
        }
    }
}

module.exports = { manageConstructionAndRepairs };
