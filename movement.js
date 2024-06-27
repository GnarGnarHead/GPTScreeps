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

function getRandomNearbyPos(pos) {
    const offsetX = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    const offsetY = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    return new RoomPosition(pos.x + offsetX, pos.y + offsetY, pos.roomName);
}

function moveToRandomNearbyPos(creep, target, visualize = false) {
    const randomPos = getRandomNearbyPos(target.pos);
    moveTo(creep, randomPos, visualize);
}

module.exports = { moveTo, say, moveToRandomNearbyPos };
