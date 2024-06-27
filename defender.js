const { moveTo, say } = require('movement');

function run(creep) {
    const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (hostile) {
        say(creep, '⚔️ attack', 3);
        if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
            moveTo(creep, hostile);
        } else if (creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
            moveTo(creep, hostile);
        }
    } else {
        // Patrol or idle logic here
        let patrolPoint = Game.flags.Patrol; // Example patrol point
        if (patrolPoint) {
            moveTo(creep, patrolPoint);
        }
    }
}

module.exports = { run };
