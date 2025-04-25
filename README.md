
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








# Documentation for the Control Class

The `Control` class is designed for managing user input and dynamically assigning keyboard shortcuts to actions (such as movement or other interactions). It supports an unlimited number of key bindings, dynamic assignment and modification of these bindings, and efficient management of key states.

## Constructor

```
constructor(options = {})
```

**Description**:  
The constructor initializes a new controller for the given object. When creating an instance of the class, you can pass a configuration object `options`, which includes both the object to be controlled and an optional initialization function.

**Parameters**:
- `options` (Object, optional): An object containing configuration options for the controller.
  - `obj` (Object, optional): The object that will be controlled. If not provided, it defaults to `null`.
  - `initializer` (Function, optional): A function that is called after the object is initialized. It can be used to perform additional setup for the object.
  - `import` (Object, optional): An object containing previously exported key bindings and corresponding functions.
  - `callbackMap` (Object, optional): A mapping of action names to callback functions that will be used when importing key bindings.

**Usage Example**:
```
const player = {
    name: "Player1",
    health: 100,
    jump: function() { console.log("Jumping!"); },
    move: function(direction) { console.log(`Moving to the ${direction}`); }
};

const control = new Control({
    obj: player,
    initializer: (obj) => {
        console.log(`Initializing object: ${obj.name}`);
        obj.health = 150;  // Example: modify health
    }
});
```

## Methods

### `update()`

```
update()
```

**Description**:  
This method updates the state of the key bindings and executes corresponding actions for all pressed keys. It should be called regularly (e.g., in each animation frame or game loop).

**Parameters**:  
None.

**Usage Example**:
```
control.update();  // Call this in each frame to process actions
```

### `bind(key, callback)`

```
bind(key, callback)
```

**Description**:  
Binds a function to a specific key for continuous holding (i.e., the action is performed as long as the key is held down).

**Parameters**:
- `key` (String): The key to bind the action to.
- `callback` (Function): The function that will be executed while the key is held down.

**Usage Example**:
```
control.bind('ArrowUp', (obj) => {
    obj.move('up');
});
```

### `bindOnce(key, callback)`

```
bindOnce(key, callback)
```

**Description**:  
Binds a function to a specific key for one-time pressing (i.e., the action is performed only when the key is pressed once).

**Parameters**:
- `key` (String): The key to bind the action to.
- `callback` (Function): The function that will be executed upon key press.

**Usage Example**:
```
control.bindOnce('Space', (obj) => {
    obj.jump();
});
```

### `captureBinding(name, type, callback)`

```
captureBinding(name, type, callback)
```

**Description**:  
Captures a key press, which will then be automatically assigned to the specified action. This is useful for dynamic key binding.

**Parameters**:
- `name` (String): The action name to bind to the key.
- `type` (String): The type of binding, either "hold" for continuous holding or "once" for one-time press.
- `callback` (Function): The function to be executed when the key is pressed.

**Usage Example**:
```
control.captureBinding('jump', 'once', (obj) => {
    obj.jump();
});
```

### `setBinding(name, type, key, callback)`

```
setBinding(name, type, key, callback)
```

**Description**:  
Sets a binding for a specific action name (e.g., jump, moveUp). This allows not only to bind new keys but also to modify existing bindings.

**Parameters**:
- `name` (String): The action name.
- `type` (String): The type of action ("hold" or "once").
- `key` (String): The key to bind to the action.
- `callback` (Function): The function that will be executed when the key is pressed.

**Usage Example**:
```
control.setBinding('jump', 'once', 'Space', (obj) => {
    obj.jump();
});
```

### `updateBinding(name, newCallback)`

```
updateBinding(name, newCallback)
```

**Description**:  
Updates the function assigned to an existing action. This allows changing the behavior of an action without changing the key binding.

**Parameters**:
- `name` (String): The action name.
- `newCallback` (Function): The new function that will be executed when the key is pressed.

**Usage Example**:
```
control.updateBinding('jump', (obj) => {
    obj.jumpHigher();
});
```

### `updateBindingKey(name, newKey)`

```
updateBindingKey(name, newKey)
```

**Description**:  
Changes the key assigned to an action. This allows dynamically updating key bindings.

**Parameters**:
- `name` (String): The action name.
- `newKey` (String): The new key to be assigned to the action.

**Usage Example**:
```
control.updateBindingKey('jump', 'Enter');
```

### `exportBindings()`

```
exportBindings()
```

**Description**:  
Returns an exported object containing all current key bindings and their types. This object can be saved for later use or sharing.

**Parameters**:  
None.

**Usage Example**:
```
const bindings = control.exportBindings();
console.log(bindings);
```

### `getBoundKey(name)`

```
getBoundKey(name)
```

**Description**:  
Returns the key currently assigned to a specific action. If no key is assigned, it returns `null`.

**Parameters**:
- `name` (String): The action name.

**Usage Example**:
```
const key = control.getBoundKey('jump');
console.log(key);  // Might return 'Space' if Space is bound to the jump action
```

## Conclusion

The `Control` class provides a highly flexible system for managing key bindings and assigning them to actions. With features like dynamic key assignment, key updating, and support for both one-time presses and long presses, this system is ideal for games or interactive applications that require advanced control over user input.
