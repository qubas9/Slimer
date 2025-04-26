# Documentation for the Game Class

The `Game` class integrates rendering and physics, managing the overall game flow.

## Constructor

```javascript
constructor(width, height, gravity = 0, drag = 1, background = [250, 250, 250])
```

**Description**:  
Creates a new `Game` instance.

**Parameters**:
- `width`, `height` (Number): Dimensions of the game canvas.
- `gravity`, `drag` (Number): Physics properties.
- `background` (Array): RGB background color.

## Methods

### `addPhysicsObjectWithSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale, mass, g, restitution, drag, hitbox)`

**Description**:  
Adds a physics object with a linked sprite.

**Parameters**:
- `x`, `y` (Number): Initial position.
- `spriteSrc` (String): URL of the sprite image.
- `spriteWidth`, `spriteHeight` (Number): Dimensions of the sprite.
- `scale`, `mass`, `g`, `restitution`, `drag` (Number): Physical properties.
- `hitbox` (Boolean): Whether the object has a hitbox.

**Returns**:
- `Object`: The created sprite and its physics object ID.

### `addFreeSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale)`

**Description**:  
Adds a free-floating sprite.

**Parameters**:
- `x`, `y` (Number): Initial position.
- `spriteSrc` (String): URL of the sprite image.
- `spriteWidth`, `spriteHeight` (Number): Dimensions of the sprite.
- `scale` (Number): Scale factor.

**Returns**:
- `Sprite`: The created sprite.

### `gameLoop()`

**Description**:  
The main game loop, updating physics and rendering.

### `addToGameLoop(func)`

**Description**:  
Adds a function to the game loop.

**Parameters**:
- `func` (Function): The function to add.

**Returns**:
- `Symbol`: A unique identifier for the function.

### `removeFromGameLoop(id)`

**Description**:  
Removes a function from the game loop.

**Parameters**:
- `id` (Symbol): The identifier of the function to remove.

### `start()`

**Description**:  
Starts the game loop.

## Conclusion

The `Game` class provides a high-level interface for managing rendering, physics, and game logic.
