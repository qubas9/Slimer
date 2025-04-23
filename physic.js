import Vector from "./vector.js";

/**
 * Physic class handles the simulation of physics, including gravity, drag, and collisions.
 */
class Physic {
    /**
     * Creates an instance of the Physic class.
     * @param {number} g - Gravity acceleration, default is 0.
     * @param {number} drag - Drag factor, default is 1.
     */
    constructor(g = 0, drag = 1) {
        this.g = g; 
        this.drag = drag; 
        this.PhObjectList = []; 
    }

    /**
     * Creates a hitbox with the given coordinates.
     * @param {number} x1 - X-coordinate of the first corner of the hitbox.
     * @param {number} y1 - Y-coordinate of the first corner of the hitbox.
     * @param {number} x2 - X-coordinate of the second corner of the hitbox.
     * @param {number} y2 - Y-coordinate of the second corner of the hitbox.
     * @returns {Hitbox} A new Hitbox object.
     */
    makeHitbox(x1, y1, x2, y2) {
        return new Hitbox(new Vector(x1, y1), new Vector(x2, y2));
    }

    /**
     * Updates all objects in the object list, checking for and resolving collisions.
     */
    update() {
        for (let i = 0; i < this.PhObjectList.length; i++) {
            this.PhObjectList[i].update();
            for (let j = i + 1; j < this.PhObjectList.length; j++) {
                if (this.PhObjectList[i].checkCollision(this.PhObjectList[j])) {
                    this.PhObjectList[i].resolveCollision(this.PhObjectList[j]);
                }
            }
        }
    }

    /**
     * Adds a physical object to the simulation.
     * @param {number} x - X-coordinate of the object.
     * @param {number} y - Y-coordinate of the object.
     * @param {Hitbox} hitbox - The hitbox associated with the object.
     * @param {number} mass - The mass of the object, default is 1.
     * @param {number} g - Gravity acceleration for the object, default is the value set in Physic.
     * @param {number} drag - Drag factor for the object, default is the value set in Physic.
     * @param {number} restitution - Restitution (elasticity) of the object, default is 1.
     * @returns {number} The ID of the newly added object.
     */
    addObj(x, y, hitbox, mass = 1, g = this.g, drag = this.drag, restitution = 1) {
        this.PhObjectList.push(new PhObj(x, y, hitbox, mass, g, drag, restitution));
        return this.PhObjectList.length - 1; // Return the ID of the object.
    }
}

/**
 * PhObj class represents a physical object in the simulation.
 */
class PhObj {
    /**
     * Creates an instance of the PhObj class.
     * @param {number} x - X-coordinate of the object.
     * @param {number} y - Y-coordinate of the object.
     * @param {Hitbox} hitbox - The hitbox associated with the object.
     * @param {number} mass - The mass of the object.
     * @param {number} g - Gravity acceleration for the object.
     * @param {number} drag - Drag factor for the object.
     * @param {number} restitution - Restitution (elasticity) of the object.
     */
    constructor(x, y, hitbox, mass = 1, g = 0, drag = 1, restitution = 1) {
        this.restitution = restitution;
        this.mass = mass;
        this.drag = drag;
        this.g = new Vector(0, g);
        this.hitbox = hitbox;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.force = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
    }

    /**
     * Applies a force to the object.
     * @param {Vector} force - The force vector to apply.
     */
    applyForce(force) {
        this.force.add(force);
    }

    /**
     * Applies an acceleration to the object.
     * @param {Vector} a - The acceleration vector to apply.
     */
    accelerate(a) {
        this.acceleration.add(a);
    }

    /**
     * Updates the object's position, velocity, and acceleration.
     */
    update() {
        this.acceleration.add(this.force.div(this.mass));
        this.velocity.add(this.acceleration).add(this.g).mult(this.drag);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
        this.force.mult(0);
    }

    /**
     * Checks if this object collides with another.
     * @param {PhObj} other - The other physical object to check collision with.
     * @returns {boolean} True if the objects are colliding, false otherwise.
     */
    checkCollision(other) {
        this.hitbox.update(this.position);
        other.hitbox.update(other.position);
        return this.hitbox.isColliding(other.hitbox);
    }

    /**
     * Resolves the collision between this object and another.
     * @param {PhObj} other - The other physical object to resolve collision with.
     */
    resolveCollision(other) {
        if (this.checkCollision(other)) {
            let collisionNormal = Vector.sub(this.position, other.position).normalize();
            let relativeVelocity = Vector.sub(this.velocity, other.velocity);
            let velocityAlongNormal = Vector.dot(relativeVelocity, collisionNormal);

            if (velocityAlongNormal > 0) return;

            let restitution = (this.restitution + other.restitution) / 2;
            let impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
            impulseMagnitude /= (1 / this.mass) + (1 / other.mass);

            let impulse = collisionNormal.mult(impulseMagnitude);
            this.velocity.add(impulse.div(this.mass)).sub(this.g);
            other.velocity.sub(impulse.div(other.mass)).sub(other.g);
        }
    }
}

/**
 * Hitbox class represents the rectangular boundary of an object.
 */
class Hitbox {
    /**
     * Creates an instance of the Hitbox class.
     * @param {Vector} corner1 - The first corner of the hitbox.
     * @param {Vector} corner2 - The opposite corner of the hitbox.
     */
    constructor(corner1, corner2) {
        this.offset1 = corner1;
        this.offset2 = corner2;
        this.position = new Vector(0, 0);
    }

    /**
     * Updates the position of the hitbox.
     * @param {Vector} position - The new position of the object.
     */
    update(position) {
        this.position = position;
    }

    /**
     * Checks if this hitbox collides with another hitbox.
     * @param {Hitbox} hitbox - The hitbox to check collision with.
     * @returns {boolean} True if the hitboxes are colliding, false otherwise.
     */
    isColliding(hitbox) {
        return !(
            (this.position.x + this.offset2.x < hitbox.position.x + hitbox.offset1.x) ||
            (hitbox.position.x + hitbox.offset2.x < this.position.x + this.offset1.x)
        ) && !(
            (this.position.y + this.offset2.y < hitbox.position.y + hitbox.offset1.y) ||
            (hitbox.position.y + hitbox.offset2.y < this.position.y + this.offset1.y)
        );
    }
}

export default Physic;
