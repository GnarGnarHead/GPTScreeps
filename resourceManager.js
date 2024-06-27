function allocateResources(room) {
    const structures = room.find(FIND_MY_STRUCTURES);
    const spawns = structures.filter(s => s.structureType === STRUCTURE_SPAWN);
    const extensions = structures.filter(s => s.structureType === STRUCTURE_EXTENSION);
    const towers = structures.filter(s => s.structureType === STRUCTURE_TOWER);

    const totalCapacity = spawns.concat(extensions).reduce((sum, s) => sum + s.store.getCapacity(RESOURCE_ENERGY), 0);
    const availableEnergy = room.energyAvailable;

    if (availableEnergy < totalCapacity * 0.5) {
        prioritizeEnergy(spawns);
    } else {
        prioritizeEnergy(spawns.concat(extensions, towers));
    }
}

function prioritizeEnergy(structures) {
    structures.forEach(structure => {
        if (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            const creep = findClosestCreep(structure.pos);
            if (creep) {
                creep.transfer(structure, RESOURCE_ENERGY);
            }
        }
    });
}

function findClosestCreep(pos) {
    return pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => creep.store[RESOURCE_ENERGY] > 0
    });
}

module.exports = { allocateResources };
