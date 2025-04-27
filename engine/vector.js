/**
 * @module Vector
 * @description A 2D vector class for basic vector operations.
 */
class Vector {
    /**
     * @constructor
     * Creates a new Vector instance.
     * @param {number} x - X coordinate of the vector.
     * @param {number} y - Y coordinate of the vector.
     * @throws {Error} If x or y is not a number.
     */
    constructor(x, y) {
        if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("X and Y of vector must be numbers");
        }
        this.x = x;
        this.y = y;
    }

    /**
     * @description Returns the magnitude of the vector.
     * @returns {number} The magnitude of the vector.
     */
    get mag() {
        const xSquare = this.x * this.x;
        const ySquare = this.y * this.y;
        return Math.sqrt(xSquare + ySquare);
    }

    /**
     * @description Adds another vector to the current vector.
     * @param {Vector} vector - The vector to add.
     * @returns {Vector} The current vector (for chaining).
     */
    add(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error("Argument must be a Vector");
        }
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     * @description Subtracts another vector from the current vector.
     * @param {Vector} vector - The vector to subtract.
     * @returns {Vector} The current vector (for chaining).
     */
    sub(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error("Argument must be a Vector");
        }
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     * @description Multiplies the vector by a scalar.
     * @param {number} scalar - The scalar to multiply by.
     * @returns {Vector} The current vector (for chaining).
     * @throws {Error} If scalar is not a number.
     */
    mult(scalar) {
        if (typeof scalar !== "number") {
            throw new Error("Scalar must be a number");
        }
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * @description Divides the vector by a scalar.
     * @param {number} scalar - The scalar to divide by.
     * @returns {Vector} The current vector (for chaining).
     * @throws {Error} If scalar is not a number or is zero.
     */
    div(scalar) {
        if (typeof scalar !== "number") {
            throw new Error("Scalar must be a number");
        }
        if (scalar === 0) {
            throw new Error("Cannot divide by zero");
        }
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    /**
     * @description Creates a copy of the vector.
     * @returns {Vector} A new vector with the same components.
     */
    copy() {
        return new Vector(this.x, this.y);
    }

    /**
     * @description Normalizes the vector to have a magnitude of 1.
     * @returns {Vector} The current vector (for chaining).
     * @throws {Error} If the vector has zero length.
     */
    normalize() {
        const mag = this.mag;
        if (mag === 0) {
            throw new Error("Cannot normalize a zero-length vector");
        }
        return this.div(mag);
    }

    /**
     * @description Sets the magnitude of the vector to a specific value.
     * @param {number} newMag - The new magnitude.
     * @returns {Vector} The current vector (for chaining).
     * @throws {Error} If newMag is not a number.
     */
    setMag(newMag) {
        if (typeof newMag !== "number") {
            throw new Error("Magnitude must be a number");
        }
        return this.normalize().mult(newMag);
    }

    /**
     * @description Adds two vectors.
     * @param {Vector} vecA - First vector.
     * @param {Vector} vecB - Second vector.
     * @returns {Vector} A new vector representing the sum.
     * @throws {Error} If inputs are not Vectors.
     */
    static add(vecA, vecB) {
        if (!(vecA instanceof Vector) || !(vecB instanceof Vector)) {
            throw new Error("Arguments must be instances of Vector");
        }
        return new Vector(vecA.x + vecB.x, vecA.y + vecB.y);
    }

    /**
     * @description Subtracts one vector from another.
     * @param {Vector} vecA - First vector.
     * @param {Vector} vecB - Second vector.
     * @returns {Vector} A new vector representing the difference.
     * @throws {Error} If inputs are not Vectors.
     */
    static sub(vecA, vecB) {
        if (!(vecA instanceof Vector) || !(vecB instanceof Vector)) {
            throw new Error("Arguments must be instances of Vector");
        }
        return new Vector(vecA.x - vecB.x, vecA.y - vecB.y);
    }

    /**
     * @description Multiplies a vector by a scalar.
     * @param {Vector} vecA - The vector to multiply.
     * @param {number} scalar - The scalar multiplier.
     * @returns {Vector} A new vector after multiplication.
     * @throws {Error} If scalar is not a number.
     */
    static mult(vecA, scalar) {
        if (!(vecA instanceof Vector)) {
            throw new Error("First argument must be a Vector");
        }
        if (typeof scalar !== "number") {
            throw new Error("Scalar must be a number");
        }
        return new Vector(vecA.x * scalar, vecA.y * scalar);
    }

    /**
     * @description Divides a vector by a scalar.
     * @param {Vector} vecA - The vector to divide.
     * @param {number} scalar - The scalar divisor.
     * @returns {Vector} A new vector after division.
     * @throws {Error} If scalar is not a number or is zero.
     */
    static div(vecA, scalar) {
        if (!(vecA instanceof Vector)) {
            throw new Error("First argument must be a Vector");
        }
        if (typeof scalar !== "number") {
            throw new Error("Scalar must be a number");
        }
        if (scalar === 0) {
            throw new Error("Cannot divide by zero");
        }
        return new Vector(vecA.x / scalar, vecA.y / scalar);
    }

    /**
     * @description Calculates the dot product of two vectors.
     * @param {Vector} vecA - First vector.
     * @param {Vector} vecB - Second vector.
     * @returns {number} The dot product.
     * @throws {Error} If inputs are not Vectors.
     */
    static dot(vecA, vecB) {
        if (!(vecA instanceof Vector) || !(vecB instanceof Vector)) {
            throw new Error("Arguments must be instances of Vector");
        }
        return vecA.x * vecB.x + vecA.y * vecB.y;
    }
}

export default Vector;
