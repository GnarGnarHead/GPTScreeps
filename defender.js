function run(creep) {
    if (creep.hits < creep.hitsMax * 0.5) {
        // Retreat if health is low
        const rallyPoint = new RoomPosition(25, 25, creep.room.name); // Adjust coordinates as needed
        creep.moveTo(rallyPoint);
        return;
    }

    const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
        filter: (hostile) => hostile.getActiveBodyparts(ATTACK) > 0 || hostile.getActiveBodyparts(RANGED_ATTACK) > 0
    });

    if (hostile) {
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile);
        }
    } else {
        const healer = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: (hostile) => hostile.getActiveBodyparts(HEAL) > 0
        });

        if (healer) {
            if (creep.attack(healer) === ERR_NOT_IN_RANGE) {
                creep.moveTo(healer);
            }
        } else {
            // Patrol if no hostiles are present
            const rallyPoint = new RoomPosition(25, 25, creep.room.name); // Adjust coordinates as needed
            creep.moveTo(rallyPoint);
        }
    }
}

module.exports = { run };
