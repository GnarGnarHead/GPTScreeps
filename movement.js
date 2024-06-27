function moveTo(creep, target, visualize = false) {
    const pathStyle = visualize ? { visualizePathStyle: { stroke: '#ffaa00' } } : {};
    creep.moveTo(target, pathStyle);
}

function say(creep, message, frequency = 10) {
    if (Game.time % frequency === 0) {
        creep.say(message, true); // The message will only be visible for one tick
    }
}

module.exports = { moveTo, say };
