const taskManager = require('./taskManager');

function runWorker(creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
        creep.memory.working = true;
        creep.say('🚧 work');
    }

    if (creep.memory.working) {
        if (taskManager.hasTasks()) {
            let task = taskManager.getTask();
            performTask(creep, task);
        } else {
            performPriorityTask(creep);
        }
    } else {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
}

function performTask(creep, task) {
    if (task.type === 'build') {
        if (creep.build(task.target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(task.target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    } else if (task.type === 'repair') {
        if (creep.repair(task.target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(task.target, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    } else if (task.type === 'upgrade') {
        if (creep.upgradeController(task.target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(task.target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
}

function performPriorityTask(creep) {
    // Priority 1: Defend the colony
    if (creep.memory.role === 'defender') {
        let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (hostile) {
            if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
            }
            return;
        }
    }

    // Priority 2: Build construction sites
    let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (target) {
        taskManager.addTask(2, 'build', target);
        performTask(creep, taskManager.getTask());
        return;
    }

    // Priority 3: Repair structures
    let repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
    });
    if (repairTarget) {
        taskManager.addTask(3, 'repair', repairTarget);
        performTask(creep, taskManager.getTask());
        return;
    }

    // Priority 4: Upgrade controller
    taskManager.addTask(4, 'upgrade', creep.room.controller);
    performTask(creep, taskManager.getTask());
}

module.exports = { run: runWorker };
