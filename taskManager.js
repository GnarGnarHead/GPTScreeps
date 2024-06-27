class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(priority, type, target) {
        this.tasks.push({ priority, type, target });
        this.tasks.sort((a, b) => a.priority - b.priority);
    }

    getTask() {
        return this.tasks.shift();
    }

    hasTasks() {
        return this.tasks.length > 0;
    }
}

module.exports = new TaskManager();
