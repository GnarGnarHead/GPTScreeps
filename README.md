# GPTScreeps

This repository contains scripts for managing a Screeps colony with modularized and efficient code.

## Features
- **Modular Movement and Messaging**: Centralized in `movement.js`.
- **Task Management**: Helper functions for construction and repairs.
- **Worker State Management**: Efficient handling of resource collection and task execution.
- **Defender and Claimer Logic**: Consistent use of centralized functions.

## File Structure
- `src/`: Contains all module scripts.
  - `movement.js`: Centralized movement and messaging logic.
  - `worker.js`: Worker creep logic.
  - `construction.js`: Construction and repair logic.
  - `defender.js`: Defender creep logic.
  - `claimer.js`: Claimer creep logic.

## Future Enhancements
- Pathfinding optimizations.
- Dynamic role assignment based on colony needs.

## Getting Started
1. Clone the repository: `git clone https://github.com/GnarGnarHead/GPTScreeps.git`
2. Update your Screeps scripts with the files from the `src/` directory.
3. Customize the configurations in the scripts as needed.

## Contributing
Feel free to submit issues or pull requests to improve the colony management scripts.

## License
This project is licensed under the MIT License.
