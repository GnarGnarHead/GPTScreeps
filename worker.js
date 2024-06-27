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
            let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 0.9 * structure.hitsMax
            });
            if (repairTarget) {
                if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                    const path = getPath(creep.pos, repairTarget.pos);
                    creep.moveByPath(path);
                }
            } else {
                let controller = creep.room.controller;
                if (controller) {
                    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                        const path = getPath(creep.pos, controller.pos);
                        creep.moveByPath(path);
                    }
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

    // Remote mining logic only if no tasks in the main room
    if (!creep.memory.working && !creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) && !creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
    }) && !creep.room.controller) {
        runRemoteMining(creep);
    }
}

function runRemoteMining(creep) {
    const targetRoomName = 'W8N3'; // Update with your remote room name
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

module.exports = { run: runWorker };
