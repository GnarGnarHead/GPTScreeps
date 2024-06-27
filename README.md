# Screeps Colony Scripts

## Current Functionality

### Roles
- **Worker**: Consolidates harvester, upgrader, builder, hauler, and repairer roles. Handles energy harvesting, upgrading, building, hauling, and repairing tasks.
- **Defender**: Manages colony defense.
- **Claimer**: Claims and reserves new rooms for expansion.
- **Towers**: Automates tower defense and repairs.

### Main Loop (`main.js`)
- Clears memory of dead creeps.
- Spawns creeps based on priority and available energy.
- Assigns tasks to creeps based on their roles.
- Manages automated tower logic for defense and repairs.

### Deprecated Roles
- The following roles have been consolidated into the `Worker` role and moved to the `deprecated` folder:
  - Harvester
  - Upgrader
  - Builder
  - Hauler
  - Repairer

## Future Development Goals

### Performance Optimization
- **Path Caching**: Implement path caching to reduce CPU usage.
- **Task Prioritization**: Dynamically adjust tasks based on room status and needs.

### Defense Enhancements
- **Advanced AI**: Enhance defender AI for better threat management.
- **Multiple Towers Coordination**: Optimize tower operations for defense.

### Scalability
- **Remote Mining**: Develop creeps and logic for mining in remote rooms.
- **Room Expansion**: Improve claiming and management of additional rooms.

### Setup Instructions
1. Clone the repository:
   ```sh
   git clone https://github.com/loslapleo/Screeps.git
