# Documentation for the Physic Class

The `Physic` class handles 2D physics simulation, including gravity, drag, and collision detection.

## Constructor

```javascript
constructor(g = 0, drag = 1)
```

**Description**:  
Creates a new `Physic` instance.

**Parameters**:
- `g` (Number): Gravity acceleration (default is 0).
- `drag` (Number): Drag factor (default is 1).

## Methods

### `makeHitbox(x1, y1, x2, y2)`

**Description**:  
Creates a rectangular hitbox.

**Parameters**:
- `x1`, `y1` (Number): Coordinates of the first corner.
- `x2`, `y2` (Number): Coordinates of the opposite corner.

**Returns**:
- `Hitbox`: A new hitbox object.

### `update()`

**Description**:  
Updates all physics objects and resolves collisions.

### `addObj(x, y, hitbox, mass, g, drag, restitution)`

**Description**:  
Adds a new physics object.

**Parameters**:
- `x`, `y` (Number): Initial position.
- `hitbox` (Hitbox): The object's hitbox.
- `mass` (Number): Mass of the object (default is 1).
- `g` (Number): Gravity (default is global gravity).
- `drag` (Number): Drag factor (default is global drag).
- `restitution` (Number): Elasticity (default is 1).

**Returns**:
- `Number`: The ID of the new object.

## Classes

### `PhObj`

Represents a physical object.

#### Constructor

```javascript
constructor(x, y, hitbox, mass, g, drag, restitution)
```

**Parameters**:
- `x`, `y` (Number): Initial position.
- `hitbox` (Hitbox): The object's hitbox.
- `mass`, `g`, `drag`, `restitution` (Number): Physical properties.

#### Methods

- `applyForce(force)`: Applies a force to the object.
- `update()`: Updates the object's position and velocity.
- `checkCollision(other)`: Checks for collision with another object.
- `resolveCollision(other)`: Resolves a collision with another object.

### `Hitbox`

Represents a rectangular boundary.

#### Constructor

```javascript
constructor(corner1, corner2)
```

**Parameters**:
- `corner1`, `corner2` (Vector): Opposite corners of the rectangle.

#### Methods

- `update(position)`: Updates the hitbox position.
- `isColliding(hitbox)`: Checks for collision with another hitbox.

## Conclusion

The `Physic` class provides a robust framework for 2D physics simulation, including collision detection and response.
