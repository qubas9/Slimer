import Vector from "./vector.js";

/**
 * Physic class handles the simulation of physics, including gravity, drag, and collisions.
 */
class Physic {
    /**
     * Creates an instance of the Physic class.
     * @param {number} g - Gravity acceleration (default is 0).
     * @param {number} drag - Drag factor (default is 1).
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
     * @param {number|boolean} [mass=1] - The mass of the object (default is 1). For unmovable objects, pass `true`.
     * @param {number} [g=this.g] - Gravity acceleration for the object (default is the value set in Physic).
     * @param {number} [drag=this.drag] - Drag factor for the object (default is the value set in Physic).
     * @param {number} [restitution=1] - Restitution (elasticity) of the object (default is 1).
     * @param {string} [colisionType="hard"] - Type of collision ("soft" or "hard", default is "hard").
     * @param {number} [softCollisionPercent=0.5] - Percentage of soft collision (default is 0.5).
     * @param {number} [softCollisionSlop=0.01] - Slop for soft collision (default is 0.01).
     * @returns {number} The ID of the newly added object.
     */
    addObj(x, y, hitbox, mass = 1, g = this.g, drag = this.drag, restitution = 1, colisionType = "hard", softCollisionPercent = 0.5, softCollisionSlop = 0.01) {
        this.PhObjectList.push(new PhObj(x, y, hitbox, mass, g, drag, restitution, colisionType, softCollisionPercent, softCollisionSlop));
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
     * @param {number|boolean} [mass=1] - The mass of the object (default is 1). For unmovable objects, pass `true`.
     * @param {number} [g=0] - Gravity acceleration for the object (default is 0).
     * @param {number} [drag=1] - Drag factor for the object (default is 1).
     * @param {number} [restitution=1] - Restitution (elasticity) of the object (default is 1).
     * @param {string} [colisionType="hard"] - Type of collision ("soft" or "hard", default is "hard").
     * @param {number} [softCollisionPercent=0.5] - Percentage of soft collision (default is 0.5).
     * @param {number} [softCollisionSlop=0.01] - Slop for soft collision (default is 0.01).
     */
    constructor(x, y, hitbox, mass = 1, g = 0, drag = 1, restitution = 1, colisionType = "hard", softCollisionPercent = 0.5, softCollisionSlop = 0.01) {
        this.restitution = restitution;
        this.collisionType = colisionType;
        this.softCollisionPercent = softCollisionPercent;
        this.softCollisionSlop = softCollisionSlop;
        this.mass = mass === true ? Infinity : mass; // Set mass to Infinity for unmovable objects
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
        if (this.mass !== Infinity) { // Skip updates for unmovable objects
            this.acceleration.add(this.force.div(this.mass));
            this.velocity.add(this.acceleration).add(this.g).mult(this.drag);
            this.position.add(this.velocity);
            this.acceleration.mult(0);
            this.force.mult(0);
        }
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
    /**
 * Resolves the collision between this object and another.
 * @param {PhObj} other - The other physical object to resolve collision with.
 */
resolveCollision(other) {
    if (this.mass === Infinity && other.mass === Infinity) return;
    if (!this.checkCollision(other)) return;
    // if (this.mass !== Infinity && other.mass !== Infinity){
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
          // }else if (this.mass === Infinity && other.mass !== Infinity) {
    //     let collisionNormal = Vector.sub(this.position, other.position).normalize();
    //     let relativeVelocity = Vector.sub(this.velocity, other.velocity);
    //     let velocityAlongNormal = Vector.dot(relativeVelocity, collisionNormal);

    //     if (velocityAlongNormal > 0) return;

    //     let restitution = (this.restitution + other.restitution) / 2;
    //     let impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
    //     impulseMagnitude /= (1 / this.mass) + (1 / other.mass);

    //     let impulse = collisionNormal.mult(impulseMagnitude);
    //     other.velocity.sub(impulse.div(other.mass)).sub(other.g);
    // }else if (this.mass !== Infinity && other.mass === Infinity) {
    //     let collisionNormal = Vector.sub(other.position, this.position).normalize();
    //     let relativeVelocity = Vector.sub(other.velocity, this.velocity);
    //     let velocityAlongNormal = Vector.dot(relativeVelocity, collisionNormal);

    //     if (velocityAlongNormal > 0) return;

    //     let restitution = (this.restitution + other.restitution) / 2;
    //     let impulseMagnitude = -(1 + restitution) * velocityAlongNormal;
    //     impulseMagnitude /= (1 / this.mass) + (1 / other.mass);

    //     let impulse = collisionNormal.mult(impulseMagnitude);
    //     this.velocity.add(impulse.div(this.mass)).sub(this.g);
    // }
    // // Pokud oba mají nekonečnou hmotnost, neděláme nic
    // if (this.mass === Infinity && other.mass === Infinity) return;

    // // Pokud se nesrážejí, nic nedělej
    // if (!this.checkCollision(other)) return;

    // // Vektor od druhého k sobě
    // const distance = Vector.sub(this.position, other.position);
    // const collisionNormal = distance.normalize();

    // // --- Unmovable reflection ---
    // if (this.mass === Infinity && other.mass !== Infinity) {
    //     // odraz druhého objektu
    //     const vAlong = Vector.dot(other.velocity, collisionNormal);
    //     other.velocity = other.velocity.sub(collisionNormal.mult(2 * vAlong));
    //     return;
    // } else if (other.mass === Infinity && this.mass !== Infinity) {
    //     // odraz tohoto objektu
    //     const normal2 = collisionNormal.mult(-1);
    //     const vAlong = Vector.dot(this.velocity, normal2);
    //     this.velocity = this.velocity.sub(normal2.mult(2 * vAlong));
    //     return;
    // }

    // // --- Oba objekty jsou pohyblivé ---
    // const relativeVelocity = Vector.sub(this.velocity, other.velocity);
    // const velocityAlongNormal = Vector.dot(relativeVelocity, collisionNormal);
    // // pokud se objekty vzdalují, neřešíme kolizi
    // if (velocityAlongNormal > 0) return;

    // // společné veličiny
    // const restitution = (this.restitution + other.restitution) / 2;
    // const inverseMassSum = (1 / this.mass) + (1 / other.mass);

    // // rozhodneme typ kolize: pokud je alespoň jeden "hard", bereme hard, jinak soft
    // const isHardCollision = (this.collisionType === "hard" || other.collisionType === "hard");

    // // impulz
    // const j = -(1 + restitution) * velocityAlongNormal / inverseMassSum;
    // const impulse = collisionNormal.mult(j);

    // if (isHardCollision) {
    //     // Hard kolize – plný impulz
    //     if (this.mass !== Infinity)    this.applyForce(impulse.div(this.mass));
    //     if (other.mass !== Infinity)   other.applyForce(impulse.div(-other.mass));
    // } else {
    //     // Soft kolize – aplikujeme softCollisionPercent
    //     if (this.mass !== Infinity)    this.applyForce(impulse.div(this.mass).mult(this.softCollisionPercent));
    //     if (other.mass !== Infinity)   other.applyForce(impulse.div(-other.mass).mult(other.softCollisionPercent));
    // }

    // // --- Korekce polohy ---
    // const overlapX =
    //     (this.hitbox.offset2.x - this.hitbox.offset1.x +
    //      other.hitbox.offset2.x - other.hitbox.offset1.x) / 2
    //     - Math.abs(distance.x);
    // const overlapY =
    //     (this.hitbox.offset2.y - this.hitbox.offset1.y +
    //      other.hitbox.offset2.y - other.hitbox.offset1.y) / 2
    //     - Math.abs(distance.y);

    // if (!isHardCollision) {
    //     // Soft correction
    //     const percent = this.softCollisionPercent ?? 0.2;
    //     const slop    = this.softCollisionSlop   ?? 0.01;
    //     if (overlapX > slop || overlapY > slop) {
    //         const correction = overlapX < overlapY
    //             ? new Vector(distance.x < 0 ? -overlapX : overlapX, 0)
    //             : new Vector(0, distance.y < 0 ? -overlapY : overlapY);
    //         const softCorr = correction.mult(percent);
    //         if (this.mass !== Infinity)  this.applyForce(softCorr.div(this.mass));
    //         if (other.mass !== Infinity) other.applyForce(softCorr.div(-other.mass));
    //     }
    // } else {
    //     // Hard correction
    //     if (overlapX > 0 && overlapY > 0) {
    //         let correction;
    //         if (overlapX < overlapY) {
    //             correction = new Vector(distance.x < 0 ? -overlapX : overlapX, 0);
    //         } else {
    //             correction = new Vector(0, distance.y < 0 ? -overlapY : overlapY);
    //         }
    //         correction.div(inverseMassSum);
    //         if (this.mass  !== Infinity) this.position.sub(Vector.div(correction, this.mass));
    //         if (other.mass !== Infinity) other.position.add(Vector.div(correction, other.mass));
    //     }
    // }
    // if (collisionNormal.x !== thhis.g.x && collisionNormal.y !== this.g.y) {
    //     this.velocity = this.velocity.sub(collisionNormal.mult(Vector.dot(this.g, collisionNormal)));
    //     other.velocity = other.velocity.sub(collisionNormal.mult(Vector.dot(other.g, collisionNormal)));
    // }
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
