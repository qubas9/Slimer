# Documentation for the Vector Class

The `Vector` class provides a 2D vector implementation with various operations such as addition, subtraction, scaling, and normalization. It is useful for physics and mathematical computations in 2D space.

## Constructor

```javascript
constructor(x, y)
```

**Description**:  
Creates a new `Vector` instance.

**Parameters**:
- `x` (Number): The x-coordinate of the vector.
- `y` (Number): The y-coordinate of the vector.

**Throws**:
- An error if `x` or `y` is not a number.

## Properties

### `x`
The x-coordinate of the vector.

### `y`
The y-coordinate of the vector.

### `mag`
**Description**:  
Returns the magnitude (length) of the vector.

**Returns**:
- `Number`: The magnitude of the vector.

## Methods

### `add(vector)`

**Description**:  
Adds another vector to the current vector.

**Parameters**:
- `vector` (Vector): The vector to add.

**Returns**:
- `Vector`: The current vector (for chaining).

**Throws**:
- An error if the argument is not a `Vector`.

### `sub(vector)`

**Description**:  
Subtracts another vector from the current vector.

**Parameters**:
- `vector` (Vector): The vector to subtract.

**Returns**:
- `Vector`: The current vector (for chaining).

**Throws**:
- An error if the argument is not a `Vector`.

### `mult(scalar)`

**Description**:  
Multiplies the vector by a scalar.

**Parameters**:
- `scalar` (Number): The scalar to multiply by.

**Returns**:
- `Vector`: The current vector (for chaining).

**Throws**:
- An error if the scalar is not a number.

### `div(scalar)`

**Description**:  
Divides the vector by a scalar.

**Parameters**:
- `scalar` (Number): The scalar to divide by.

**Returns**:
- `Vector`: The current vector (for chaining).

**Throws**:
- An error if the scalar is not a number or is zero.

### `copy()`

**Description**:  
Creates a copy of the vector.

**Returns**:
- `Vector`: A new vector with the same components.

### `normalize()`

**Description**:  
Normalizes the vector to have a magnitude of 1.

**Returns**:
- `Vector`: The current vector (for chaining).

**Throws**:
- An error if the vector has zero length.

### `setMag(newMag)`

**Description**:  
Sets the magnitude of the vector to a specific value.

**Parameters**:
- `newMag` (Number): The new magnitude.

**Returns**:
- `Vector`: The current vector (for chaining).

**Throws**:
- An error if `newMag` is not a number.

### Static Methods

#### `Vector.add(vecA, vecB)`

**Description**:  
Adds two vectors.

**Parameters**:
- `vecA` (Vector): The first vector.
- `vecB` (Vector): The second vector.

**Returns**:
- `Vector`: A new vector representing the sum.

**Throws**:
- An error if the inputs are not `Vector` instances.

#### `Vector.sub(vecA, vecB)`

**Description**:  
Subtracts one vector from another.

**Parameters**:
- `vecA` (Vector): The first vector.
- `vecB` (Vector): The second vector.

**Returns**:
- `Vector`: A new vector representing the difference.

**Throws**:
- An error if the inputs are not `Vector` instances.

#### `Vector.mult(vecA, scalar)`

**Description**:  
Multiplies a vector by a scalar.

**Parameters**:
- `vecA` (Vector): The vector to multiply.
- `scalar` (Number): The scalar multiplier.

**Returns**:
- `Vector`: A new vector after multiplication.

**Throws**:
- An error if the scalar is not a number.

#### `Vector.div(vecA, scalar)`

**Description**:  
Divides a vector by a scalar.

**Parameters**:
- `vecA` (Vector): The vector to divide.
- `scalar` (Number): The scalar divisor.

**Returns**:
- `Vector`: A new vector after division.

**Throws**:
- An error if the scalar is not a number or is zero.

#### `Vector.dot(vecA, vecB)`

**Description**:  
Calculates the dot product of two vectors.

**Parameters**:
- `vecA` (Vector): The first vector.
- `vecB` (Vector): The second vector.

**Returns**:
- `Number`: The dot product.

**Throws**:
- An error if the inputs are not `Vector` instances.

## Conclusion

The `Vector` class is a versatile utility for 2D vector operations, making it ideal for physics simulations, graphics, and mathematical computations.
