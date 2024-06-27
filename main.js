const { assignTasks } = require('./taskManager');
const towers = require('./towers');

module.exports.loop = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    assignTasks();

    const towersArray = _.filter(Game.structures, (structure) => structure.structureType === STRUCTURE_TOWER);
    for (let t of towersArray) {
        towers.run(t);
    }
};
