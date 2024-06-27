function moveTo(creep, target, visualize = false) {
    const pathStyle = visualize ? { visualizePathStyle: { stroke: '#ffaa00' } } : {};
    creep.moveTo(target, pathStyle);
}

function say(creep, message, frequency = 10) {
    if (!creep.memory.lastSay || Game.time - creep.memory.lastSay > frequency) {
        creep.say(message, true); // The message will only be visible for one tick
        creep.memory.lastSay = Game.time;
    }
}

module.exports = { moveTo, say };
