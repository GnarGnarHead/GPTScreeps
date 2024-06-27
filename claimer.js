const { moveTo, say } = require('movement');

function run(creep) {
    if (creep.memory.claiming && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.claiming = false;
        say(creep, '🔄 harvest');
    }
    if (!creep.memory.claiming && creep.store.getFreeCapacity() === 0) {
        creep.memory.claiming = true;
        say(creep, '🏴 claim');
    }

    if (creep.memory.claiming) {
        const targetRoom = 'W8N3'; // Replace with your target room
        if (creep.room.name !== targetRoom) {
            let exitDir = creep.room.findExitTo(targetRoom);
            let exit = creep.pos.findClosestByRange(exitDir);
            moveTo(creep, exit);
        } else {
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                moveTo(creep, creep.room.controller);
            }
        }
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            moveTo(creep, source);
        }
    }
}

module.exports = { run };
