# Screeps Colony Scripts

## Overview

This repository contains scripts for managing a Screeps colony, including roles for workers, defenders, and claimers. The main goals are to optimize resource management, defense, and colony expansion.

## Current Functionality

### Roles

- **Worker**: Handles harvesting, upgrading, building, repairing, and remote mining.
- **Defender**: Manages colony defense.
- **Claimer**: Claims and reserves new rooms for expansion.
- **Towers**: Automates tower defense and repairs.

### Main Loop (`main.js`)

- Clears memory of dead creeps.
- Spawns creeps based on priority and available energy.
- Assigns tasks to creeps based on their roles.
- Manages automated tower logic for defense and repairs.

### Task Prioritization

Workers prioritize tasks in the following order:
1. Building
2. Repairing
3. Upgrading
4. Harvesting
5. Remote Mining

## Future Development Goals

### Performance Optimization

- **Path Caching**: Implement caching for frequently used paths to reduce CPU usage.
- **Task Efficiency**: Optimize task management to minimize idle time for creeps.

### Defense Enhancements

- **Advanced AI for Defenders**: Enhance the logic for defenders to handle various threats more effectively.
- **Defensive Structures**: Plan and construct walls, ramparts, and additional towers.

### Scalability

- **Remote Mining**: Develop creeps and logic for mining in remote rooms.
- **Room Expansion**: Improve claiming and management of additional rooms.

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/loslapleo/Screeps.git
