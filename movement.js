function moveTo(creep, target, visualize = false) {
    const pathStyle = visualize ? { visualizePathStyle: { stroke: '#ffaa00' } } : {};
    creep.moveTo(target, pathStyle);
}

function say(creep, message, duration = 3) {
    creep.say(message, duration);
}

module.exports = { moveTo, say };
