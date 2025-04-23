
# The README for the engine of the Slimer game

This project is a simple 2D physics and rendering game engine built using JavaScript. It provides a structure for managing game objects (sprites), physics, and rendering. The game engine supports both physics-linked and free-floating sprites.

## Overview

The game consists of the following main components:

1. **Render Class**: Handles rendering of sprites and backgrounds to the canvas.
2. **Physic Class**: Simulates 2D physics with properties like gravity, drag, and restitution.
3. **Game Class**: Manages the overall game flow, integrates physics and rendering, and handles the game loop.

## Installation

To use this engine, simply include the required JavaScript files in your project.

```bash
# Add the following scripts to your HTML file
<script src="render.js"></script>
<script src="physic.js"></script>
<script src="game.js"></script>
```

Alternatively, you can use them as ES6 modules:

```javascript
import Render from "./render.js";
import Physic from "./physic.js";
import Game from "./game.js";
```

## Class Breakdown

### Render Class

The `Render` class manages the canvas and renders sprites and backgrounds. It is responsible for drawing everything visible in the game.

#### Constructor

```javascript
constructor(width, height, background = [250, 250, 250])
```

- `width`: The width of the canvas.
- `height`: The height of the canvas.
- `background`: The background color of the canvas (RGB array).

#### Methods

- `addSprite(sprite)`: Adds a sprite to the renderer.
- `makeSprite(x, y, imageSrc, width, height, scale = 1)`: Creates a new sprite.
- `render()`: Renders the scene, including the background and all sprites.

### Sprite Class

The `Sprite` class represents an image that can be rendered on the canvas.

#### Constructor

```javascript
constructor(x, y, imageSrc, width, height, scale = 1, onLoadCallback)
```

- `x`, `y`: The position of the sprite on the canvas.
- `imageSrc`: The image URL for the sprite.
- `width`, `height`: The dimensions of the sprite.
- `scale`: The scale factor for the sprite (default is 1).
- `onLoadCallback`: A callback function that runs when the image is loaded.

#### Properties

- `x`, `y`: The position of the sprite.
- `width`, `height`: The dimensions of the sprite, adjusted by the scale factor.
- `loaded`: A boolean indicating if the image has loaded.

### Physic Class

The `Physic` class handles all physics-related calculations for the game.

#### Constructor

```javascript
constructor(gravity = 0, drag = 1)
```

- `gravity`: The gravity force in the simulation (default is 0).
- `drag`: The drag constant applied to objects (default is 1).

#### Methods

- `addObj(x, y, hitbox, mass, g, drag, restitution)`: Adds a new physics object.
- `update()`: Updates the physics engine.

### Game Class

The `Game` class integrates the `Render` and `Physic` classes, managing the overall game flow, game loop, and interaction between game objects.

#### Constructor

```javascript
constructor(width, height, gravity = 0, drag = 1, background = [250, 250, 250])
```

- `width`, `height`: The dimensions of the game canvas.
- `gravity`: The gravity constant for physics.
- `drag`: The drag constant for physics.
- `background`: The background color of the canvas.

#### Methods

- `addPhysicsObjectWithSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale = 1, mass = 1, g, restitution = 1, drag, hitbox = true)`: Adds a physics object and its linked sprite to the game.
- `addFreeSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale = 1)`: Adds a free-floating sprite (not linked to physics).
- `gameLoop()`: The game loop that updates physics and renders the scene.
- `start()`: Starts the game loop.

## Example Usage

Here's an example of how to use the engine to create a game:

```javascript
// Create a new game instance
let game = new Game(800, 600, 0.1, 1, [0, 0, 0]);

// Add physics objects with linked sprites
let { sprite: sprite1, objectId: objectId1 } = game.addPhysicsObjectWithSprite(100, 400, "./Slimer.png", 20, 20, 4, 100, -0.1, 0, 0.9);
let { sprite: sprite2, objectId: objectId2 } = game.addPhysicsObjectWithSprite(100, 200, "./Slimer.png", 20, 20, 4, 100, -0.1, 0, 0.9);

// Add a free-floating sprite
let freeSprite = game.addFreeSprite(400, 200, "./Slimer.png", 20, 20, 4);

// Start the game loop
game.start();
```

## Features

- **Physics Engine**: Simulate gravity, drag, and restitution for game objects.
- **Sprite Management**: Easily manage and render sprites.
- **Flexible Object Creation**: Add both physics-linked and free-floating sprites.
- **Game Loop**: The engine continuously updates physics and renders the scene.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
