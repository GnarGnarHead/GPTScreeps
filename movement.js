function moveTo(creep, target, visualize = false) {
    const pathStyle = visualize ? { visualizePathStyle: { stroke: '#ffaa00' } } : {};
    creep.moveTo(target, pathStyle);
}

module.exports = { moveTo };
