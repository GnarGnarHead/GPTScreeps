function runUpgrader(creep) {
    if (creep.store[RESOURCE_ENERGY] == 0) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        let controller = creep.room.controller;
        if (controller && creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

module.exports = { run: runUpgrader };
