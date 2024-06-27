/**
 * Claimer Module
 * 
 * This module defines the behavior of claimer creeps.
 * The primary function of a claimer is to claim or reserve new rooms for expansion.
 */

function runClaimer(creep) {
    if (!creep.room.controller || !creep.room.controller.my) {
        if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
}

module.exports = { run: runClaimer };
