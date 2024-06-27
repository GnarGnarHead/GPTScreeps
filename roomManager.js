function manageRoom(room) {
    if (!room.controller || !room.controller.my) {
        // Logic to send claimers if the room is not owned
        let claimers = _.filter(Game.creeps, (creep) => creep.memory.role === 'claimer' && creep.memory.target === room.name);
        if (claimers.length === 0) {
            let spawn = _.find(Game.spawns, (s) => s.room.energyAvailable >= 650);
            if (spawn) {
                spawn.spawnCreep([CLAIM, MOVE], 'Claimer' + Game.time, { memory: { role: 'claimer', target: room.name } });
            }
        }
    } else {
        // Logic to set up spawn, extensions, and defenses if the room is owned
        createConstructionSites(room);
    }
}

function createConstructionSites(room) {
    // Example: Create construction sites for extensions around the spawn
    let spawn = room.find(FIND_MY_SPAWNS)[0];
    if (spawn) {
        let positions = [
            { x: spawn.pos.x - 1, y: spawn.pos.y - 1 },
            { x: spawn.pos.x - 1, y: spawn.pos.y + 1 },
            { x: spawn.pos.x + 1, y: spawn.pos.y - 1 },
            { x: spawn.pos.x + 1, y: spawn.pos.y + 1 },
        ];
        for (let pos of positions) {
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_EXTENSION);
        }
    }
}

module.exports = { manageRoom };
