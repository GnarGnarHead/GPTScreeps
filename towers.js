/**
 * Tower Module
 * 
 * This module defines the behavior of towers.
 * Towers prioritize attacking the highest threat targets and repairing structures.
 */

function run(tower) {
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
        tower.attack(closestHostile);
    } else {
        const damagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (damagedStructure) {
            tower.repair(damagedStructure);
        }
    }
}

module.exports = { run };
