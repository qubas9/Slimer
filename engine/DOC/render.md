# Documentation for the Render Class

The `Render` class manages canvas rendering, including drawing sprites and backgrounds.

## Constructor

```javascript
constructor(width, height, background = [250, 250, 250])
```

**Description**:  
Creates a new `Render` instance.

**Parameters**:
- `width`, `height` (Number): Dimensions of the canvas.
- `background` (Array): RGB background color (default is light gray).

## Methods

### `addSprite(sprite)`

**Description**:  
Adds a sprite to the render queue.

**Parameters**:
- `sprite` (Sprite): The sprite to add.

**Throws**:
- An error if the argument is not a `Sprite`.

### `makeSprite(x, y, imageSrc, width, height, scale)`

**Description**:  
Creates a new sprite.

**Parameters**:
- `x`, `y` (Number): Position of the sprite.
- `imageSrc` (String): URL of the sprite image.
- `width`, `height` (Number): Dimensions of the sprite.
- `scale` (Number): Scale factor (default is 1).

**Returns**:
- `Sprite`: A new sprite instance.

### `render()`

**Description**:  
Renders the canvas, including the background and all sprites.

## Classes

### `Sprite`

Represents a visual element.

#### Constructor

```javascript
constructor(x, y, imageSrc, width, height, scale, onLoadCallback)
```

**Parameters**:
- `x`, `y` (Number): Position of the sprite.
- `imageSrc` (String): URL of the sprite image.
- `width`, `height` (Number): Dimensions of the sprite.
- `scale` (Number): Scale factor (default is 1).
- `onLoadCallback` (Function): Callback when the image is loaded.

#### Properties

- `x`, `y` (Number): Position of the sprite.
- `width`, `height` (Number): Dimensions of the sprite.
- `loaded` (Boolean): Whether the image is loaded.

## Conclusion

The `Render` class simplifies canvas rendering, making it easy to manage and draw sprites.
