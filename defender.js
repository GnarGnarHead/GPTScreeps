/**
 * Defender Module
 * 
 * This module defines the behavior of defender creeps.
 * The primary function of a defender is to protect the colony from hostile creeps.
 * Defenders will seek out and attack enemies within their range.
 * If no enemies are present, defenders will move to a designated defensive position.
 */

function runDefender(creep) {
    let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (target) {
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        creep.moveTo(Game.flags.Defend); // Move to a defensive position
    }
}

module.exports = { run: runDefender };
