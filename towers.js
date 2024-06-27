/**
 * Tower Module
 * 
 * This module automates the behavior of towers for defense and repairs.
 * Towers will prioritize attacking enemies, then healing creeps, and finally repairing structures.
 */

module.exports = {
    run: function(tower) {
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else {
            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            } else {
                let closestDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (creep) => creep.hits < creep.hitsMax
                });
                if (closestDamagedCreep) {
                    tower.heal(closestDamagedCreep);
                }
            }
        }
    }
};
