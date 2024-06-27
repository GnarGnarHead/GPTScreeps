const roles = ['worker', 'defender', 'claimer'];

function assignTasks() {
    const tasks = [];
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (roles.includes(creep.memory.role)) {
            tasks.push({ creep: creep, priority: getTaskPriority(creep) });
        }
    }

    tasks.sort((a, b) => a.priority - b.priority);
    tasks.forEach(task => {
        const roleModule = require(task.creep.memory.role);
        roleModule.run(task.creep);
    });
}

function getTaskPriority(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        return 1; // Harvesting
    } else if (creep.store[RESOURCE_ENERGY] > 0) {
        let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (constructionSite) {
            return 2; // Building
        }
        let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (structure) {
            return 3; // Repairing
        }
        let controller = creep.room.controller;
        if (controller) {
            return 4; // Upgrading
        }
    }
    return 5; // Idle or Remote Mining
}

module.exports = { assignTasks };
