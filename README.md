# Screeps Colony Scripts

## Current Functionality

### Roles
- **Harvester**: Gathers energy from sources and delivers it to spawns, extensions, and storage.
- **Upgrader**: Collects energy and upgrades the room controller.
- **Builder**: Constructs buildings and repairs structures.
- **Hauler**: Transports energy between sources, storage, and structures.
- **Defender**: Attacks hostile creeps to protect the colony.
- **Claimer**: Claims and reserves new rooms for expansion.
- **Repairer**: Repairs damaged structures.

### Main Loop (`main.js`)
- Clears memory of dead creeps.
- Spawns creeps based on priority and available energy.
- Assigns tasks to creeps based on their roles.
- Manages automated tower logic for defense and repairs.

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
