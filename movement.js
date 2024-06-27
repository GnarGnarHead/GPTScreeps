function moveTo(creep, target, visualize = false) {
    const pathStyle = visualize ? { visualizePathStyle: { stroke: '#ffaa00' } } : {};
    creep.moveTo(target, pathStyle);
}

function say(creep, message) {
    creep.say(message, true); // The message will only be visible for one tick
}

module.exports = { moveTo, say };
