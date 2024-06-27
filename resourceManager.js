function manageResources(room) {
    const sources = room.find(FIND_SOURCES);
    const storages = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_STORAGE ||
                                structure.structureType === STRUCTURE_CONTAINER
    });

    sources.forEach(source => {
        const availableWorkers = _.filter(Game.creeps, creep => creep.memory.role === 'worker' && !creep.memory.working);
        if (availableWorkers.length > 0) {
            const worker = availableWorkers[0];
            if (worker.harvest(source) === ERR_NOT_IN_RANGE) {
                worker.moveTo(source);
            }
        }
    });

    storages.forEach(storage => {
        if (storage.store[RESOURCE_ENERGY] < storage.store.getCapacity(RESOURCE_ENERGY) * 0.5) {
            const workers = _.filter(Game.creeps, creep => creep.memory.role === 'worker' && creep.store[RESOURCE_ENERGY] > 0);
            if (workers.length > 0) {
                const worker = workers[0];
                if (worker.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    worker.moveTo(storage);
                }
            }
        }
    });
}

module.exports = { manageResources };
