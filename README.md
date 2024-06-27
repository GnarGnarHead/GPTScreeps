
# Screeps Colony Scripts

## Overview

This repository contains scripts for managing a Screeps colony, including roles, task management, defense logic, and room expansion.

## File Structure



src/
├── main.js
├── taskManager.js
├── towers.js
├── cache.js
├── construction.js
├── worker.js
├── defender.js
├── claimer.js
└── roomManager.js


## Modules

### main.js
- Clears memory of dead creeps.
- Spawns creeps based on priorities.
- Assigns tasks using taskManager.
- Runs tower defense logic.
- Manages room infrastructure and expansion.

### taskManager.js
- Assigns tasks to creeps based on role.
- Prioritizes tasks dynamically.

### towers.js
- Manages tower behavior for attacking hostiles and repairing structures.

### cache.js
- Provides path caching to optimize CPU usage.

### construction.js
- Manages the creation of construction sites for extensions and containers.

### worker.js
- Consolidates harvesting, upgrading, building, repairing, hauling, and remote mining tasks.
- Includes emergency defense logic.

### defender.js
- Manages defender creep behavior for attacking hostiles.

### claimer.js
- Manages claimer creep behavior for claiming new rooms.

### roomManager.js
- Manages room infrastructure and expansion.
- Sends claimers to new rooms and sets up basic infrastructure.

## Future Development Goals

1. **Performance Optimization**:
   - Implement advanced path caching.
   - Optimize task management efficiency.

2. **Defense Enhancements**:
   - Improve defender AI.
   - Coordinate multiple towers for better defense.

3. **Room Expansion**:
   - Implement remote mining operations.
   - Develop logic for claiming and managing additional rooms.

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/loslapleo/Screeps.git
