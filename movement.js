function moveTo(creep, target, visualize = false) {
    if (!creep.memory._move || creep.memory._move.target !== target.id) {
        const path = creep.pos.findPathTo(target, { ignoreCreeps: true });
        creep.memory._move = { path: Room.serializePath(path), target: target.id };
    }
    
    const pathStyle = visualize ? { visualizePathStyle: { stroke: '#ffaa00' } } : {};
    creep.moveByPath(creep.memory._move.path, pathStyle);
}

function say(creep, message, frequency = 10) {
    if (!creep.memory.lastSay || Game.time - creep.memory.lastSay > frequency) {
        creep.say(message, true); // The message will only be visible for one tick
        creep.memory.lastSay = Game.time;
    }
}

module.exports = { moveTo, say };
