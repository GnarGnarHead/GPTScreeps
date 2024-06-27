function runBuilder(creep) {
    if (creep.store.getFreeCapacity() > 0) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#53ff1a'}});
            }
        } else {
            let repairs = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            if(repairs.length) {
                if(creep.repair(repairs[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairs[0], {visualizePathStyle: {stroke: '#ffea00'}});
                }
            }
        }
    }
}

module.exports = { run: runBuilder };
