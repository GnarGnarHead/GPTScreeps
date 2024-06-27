function createConstructionSites(room) {
    try {
        const extensionCount = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_EXTENSION && structure.room.name === room.name).length;
        const extensionSitesCount = _.filter(Game.constructionSites, (site) => site.structureType === STRUCTURE_EXTENSION && site.room.name === room.name).length;
        const maxExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];

        const containerCount = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_CONTAINER && structure.room.name === room.name).length;
        const containerSitesCount = _.filter(Game.constructionSites, (site) => site.structureType === STRUCTURE_CONTAINER && site.room.name === room.name).length;
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
