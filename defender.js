/**
 * Defender Module
 * 
 * This module defines the behavior of defender creeps.
 * Defenders prioritize attacking the highest threat targets.
 */

function runDefender(creep) {
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        } else if (creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
            creep.moveTo(hostile, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    } else {
        // Patrol or move to a designated defensive position if no hostiles
        const patrolPoints = creep.room.find(FIND_FLAGS, { filter: flag => flag.color === COLOR_RED });
        if (patrolPoints.length > 0) {
            creep.moveTo(patrolPoints[0], { visualizePathStyle: { stroke: '#00ff00' } });
        }
    }
}

module.exports = { run: runDefender };
