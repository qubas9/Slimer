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

### `addObj(x, y, hitbox, mass, g, drag, restitution, colisionType, softCollisionPercent, softCollisionSlop)`

**Description**:  
Adds a new physics object.

**Parameters**:
- `x`, `y` (Number): Initial position.
- `hitbox` (Hitbox): The object's hitbox.
- `mass` (Number|Boolean, default is 1): Mass of the object. Pass `true` for unmovable objects.
- `g` (Number, default is global gravity): Gravity acceleration for the object.
- `drag` (Number, default is global drag): Drag factor for the object.
- `restitution` (Number, default is 1): Elasticity of the object.
- `colisionType` (String, default is "hard"): Type of collision ("soft" or "hard").
- `softCollisionPercent` (Number, default is 0.5): Percentage of soft collision.
- `softCollisionSlop` (Number, default is 0.01): Slop for soft collision.

**Returns**:
- `Number`: The ID of the new object.

## Classes

### `PhObj`

Represents a physical object.

#### Constructor

```javascript
constructor(x, y, hitbox, mass = 1, g = 0, drag = 1, restitution = 1, colisionType = "hard", softCollisionPercent = 0.5, softCollisionSlop = 0.01)
```

**Parameters**:
- `x`, `y` (Number): Initial position.
- `hitbox` (Hitbox): The object's hitbox.
- `mass` (Number|Boolean, default is 1): Mass of the object. Pass `true` for unmovable objects.
- `g` (Number, default is 0): Gravity acceleration for the object.
- `drag` (Number, default is 1): Drag factor for the object.
- `restitution` (Number, default is 1): Elasticity of the object.
- `colisionType` (String, default is "hard"): Type of collision ("soft" or "hard").
- `softCollisionPercent` (Number, default is 0.5): Percentage of soft collision.
- `softCollisionSlop` (Number, default is 0.01): Slop for soft collision.

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

## Collision Types

### Hard Collision
Hard collisions resolve by applying impulses and correcting penetration depth to prevent overlap.

### Soft Collision
Soft collisions resolve by applying a percentage of the overlap as a correction force, allowing for smoother interactions.

## Conclusion

The `Physic` class provides a robust framework for 2D physics simulation, including collision detection and response. It supports both movable and unmovable objects.
