# Slimer Game Engine

This project is a modular 2D physics and rendering game engine built using JavaScript. It provides a structure for managing game objects (sprites), physics, and rendering. The game engine supports both physics-linked and free-floating sprites.

## Modular Structure

The engine is divided into the following modules, each responsible for a specific aspect of the game:

1. **Render Module**  
   Handles rendering of sprites and backgrounds to the canvas.  
   **Dependencies**: None.

2. **Physic Module**  
   Simulates 2D physics with properties like gravity, drag, and restitution.  
   **Dependencies**: `Vector`.

3. **Game Module**  
   Integrates the `Render` and `Physic` modules to manage the overall game flow, game loop, and interactions between game objects.  
   **Dependencies**: `Render`, `Physic`.

4. **Control Module**  
   Manages user input and key bindings for controlling game objects.  
   **Dependencies**: None.

5. **Vector Module**  
   Provides utility functions for 2D vector operations such as addition, subtraction, scaling, and normalization.  
   **Dependencies**: None.

### Module Dependency Diagram

```
Control
   ↑
Game → Render
   ↘
   Physic → Vector
```

### Documentation Overview

The documentation is divided into multiple files. Each file provides detailed information about a specific module:

1. [Render Module Documentation](docs/render.md)  
   Detailed explanation of the `Render` module.

2. [Physic Module Documentation](docs/physic.md)  
   Comprehensive guide to the `Physic` module.

3. [Game Module Documentation](docs/game.md)  
   Overview of the `Game` module.

4. [Control Module Documentation](docs/control.md)  
   Detailed description of the `Control` module.

5. [Vector Module Documentation](docs/vector.md)  
   Explanation of the `Vector` module and its utility functions.

### Getting Started

Refer to the [Installation Guide](docs/installation.md) for instructions on how to set up and use the engine in your project.

### Example Usage

For a quick start, check out the [Example Usage](docs/example.md) file, which demonstrates how to create a simple game using the engine.

## Features

- **Physics Engine**: Simulate gravity, drag, and restitution for game objects.
- **Sprite Management**: Easily manage and render sprites.
- **Flexible Object Creation**: Add both physics-linked and free-floating sprites.
- **Game Loop**: The engine continuously updates physics and renders the scene.
- **Modular Design**: Each module is independent and reusable.
- **Vector Utilities**: Perform common 2D vector operations efficiently.

## Contributing

Refer to the [Contributing Guidelines](docs/contributing.md) for details on how to contribute to the project.

## License

This project is licensed under the [MIT License](LICENSE).
