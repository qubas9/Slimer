# Documentation for the Game Class

The `Game` class integrates rendering and physics, managing the overall game flow.

## Constructor

```javascript
constructor(width, height, gravity = 0, drag = 1, background = [250, 250, 250])
```

**Description**:  
Creates a new `Game` instance.

**Parameters**:
- `width`, `height` (Number): Dimensions of the game canvas in pixels.
- `gravity` (Number): The gravitational acceleration applied to physics objects (default is 0).
- `drag` (Number): The drag coefficient that slows down moving objects (default is 1).
- `background` (Array): RGB values representing the background color of the canvas (e.g., `[255, 255, 255]` for white).

## Methods

### `addPhysicsObjectWithSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale, mass, g, restitution, drag, hitbox)`

**Description**:  
Adds a physics object with a linked sprite.

**Parameters**:
- `x`, `y` (Number): Initial position of the object in pixels.
- `spriteSrc` (String): URL or file path of the sprite image.
- `spriteWidth`, `spriteHeight` (Number): Dimensions of the sprite in pixels.
- `scale` (Number): Scale factor to resize the sprite (default is 1).
- `mass` (Number): Mass of the physics object, affecting its response to forces (default is 1).
- `g` (Number): Gravity specific to this object, overriding the global gravity (default is the global gravity).
- `restitution` (Number): Bounciness of the object, where 1 is fully elastic and 0 is inelastic (default is 1).
- `drag` (Number): Drag coefficient specific to this object, overriding the global drag (default is the global drag).
- `hitbox` (Hitbox): The hitbox defining the object's collision boundaries. If `true`, a default hitbox is created.

**Returns**:
- `Object`: The created sprite and its physics object ID.

### `addFreeSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale)`

**Description**:  
Adds a free-floating sprite.

**Parameters**:
- `x`, `y` (Number): Initial position of the sprite in pixels.
- `spriteSrc` (String): URL or file path of the sprite image.
- `spriteWidth`, `spriteHeight` (Number): Dimensions of the sprite in pixels.
- `scale` (Number): Scale factor to resize the sprite (default is 1).

**Returns**:
- `Sprite`: The created sprite.

### `gameLoop()`

**Description**:  
The main game loop, updating physics and rendering.

### `addToGameLoop(func)`

**Description**:  
Adds a function to the game loop.

**Parameters**:
- `func` (Function): The function to execute during each iteration of the game loop.

**Returns**:
- `Symbol`: A unique identifier for the function.

### `removeFromGameLoop(id)`

**Description**:  
Removes a function from the game loop.

**Parameters**:
- `id` (Symbol): The unique identifier of the function to remove.

### `start()`

**Description**:  
Starts the game loop.

## Conclusion

The `Game` class provides a high-level interface for managing rendering, physics, and game logic.
