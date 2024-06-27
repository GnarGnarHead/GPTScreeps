const pathCache = {};

function getPath(fromPos, toPos) {
    const key = `${fromPos.roomName},${fromPos.x},${fromPos.y},${toPos.roomName},${toPos.x},${toPos.y}`;
    if (pathCache[key]) {
        return pathCache[key];
    } else {
        const path = fromPos.findPathTo(toPos, { ignoreCreeps: true });
        pathCache[key] = path;
        return path;
    }
}

module.exports = { getPath };
