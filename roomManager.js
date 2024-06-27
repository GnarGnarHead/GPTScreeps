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
    try {
        const structures = Game.structures;
        const constructionSites = Game.constructionSites;

        const extensionCount = _.filter(structures, (structure) => {
            if (!structure || !structure.structureType || !structure.room || !structure.room.name) {
                console.log('Undefined structure in extensionCount:', JSON.stringify(structure));
                return false;
            }
            return structure.structureType === STRUCTURE_EXTENSION && structure.room.name === room.name;
        }).length;

        const extensionSitesCount = _.filter(constructionSites, (site) => {
            if (!site || !site.structureType || !site.room || !site.room.name) {
                console.log('Undefined site in extensionSitesCount:', JSON.stringify(site));
                return false;
            }
            return site.structureType === STRUCTURE_EXTENSION && site.room.name === room.name;
        }).length;

        const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];

        const containerCount = _.filter(structures, (structure) => {
            if (!structure || !structure.structureType || !structure.room || !structure.room.name) {
                console.log('Undefined structure in containerCount:', JSON.stringify(structure));
                return false;
            }
            return structure.structureType === STRUCTURE_CONTAINER && structure.room.name === room.name;
        }).length;

        const containerSitesCount = _.filter(constructionSites, (site) => {
            if (!site || !site.structureType || !site.room || !site.room.name) {
                console.log('Undefined site in containerSitesCount:', JSON.stringify(site));
                return false;
            }
            return site.structureType === STRUCTURE_CONTAINER && site.room.name === room.name;
        }).length;

        const maxContainers = CONTROLLER_STRUCTURES[STRUCTURE_CONTAINER][room.controller.level];

        if (extensionCount + extensionSitesCount < maxExtensions) {
            for (let x = room.controller.pos.x - 5; x <= room.controller.pos.x + 5; x++) {
                for (let y = room.controller.pos.y - 5; y <= room.controller.pos.y + 5; y++) {
                    if (room.createConstructionSite(x, y, STRUCTURE_EXTENSION) === OK) {
                        return true;
                    }
                }
            }
        }

        if (containerCount + containerSitesCount < maxContainers) {
            for (let x = room.controller.pos.x - 5; x <= room.controller.pos.x + 5; x++) {
                for (let y = room.controller.pos.y - 5; y <= room.controller.pos.y + 5; y++) {
                    if (room.createConstructionSite(x, y, STRUCTURE_CONTAINER) === OK) {
                        return true;
                    }
                }
            }
        }
    } catch (error) {
        console.log('Error in createConstructionSites:', error);
    }

    return false;
}

module.exports = { manageRoom };
