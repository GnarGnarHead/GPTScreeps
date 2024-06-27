**# Screeps Colony Management

## Overview
This repository contains scripts for managing a Screeps colony. The code is modularized to handle different aspects of colony management, including creep roles, resource management, and construction.

## Modules

### movement.js
Handles creep movement, including path randomization to prevent congestion.

### worker.js
Manages worker tasks such as harvesting, transporting, building, and repairing.

### resourceManager.js
Oversees resource collection and distribution to ensure optimal energy levels in storages.

### main.js
Main loop that handles role assignment, memory cleanup, spawning logic, and periodic resource management tasks.

## Features
- **Modular Design**: Clear separation of responsibilities across different modules.
- **Efficient Resource Management**: Ensures resources are collected and distributed efficiently.
- **Dynamic Role Assignment**: Adjusts the number of creeps based on current needs.
- **Path Randomization**: Reduces creep congestion around resource sources.

## Future Improvements
- **Advanced Defense Strategies**: Enhance tower management and defender roles.
- **Dynamic Room Expansion**: Implement logic for remote mining and claiming new rooms.
- **Performance Optimization**: Continuously monitor and optimize CPU usage.

## Usage
1. Clone the repository to your Screeps environment.
2. Ensure all modules are correctly placed in the respective folders.
3. Adjust the configuration in `main.js` as needed for your colony.

## Contributing
Feel free to submit pull requests to improve the scripts or add new features.

## License
This project is licensed under the MIT License.
**
