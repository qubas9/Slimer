import {Vector} from "../coretools.js";
/**
 * Hitbox class represents the rectangular boundary of an object.
 */
class Hitbox {
    /**
     * Creates an instance of the Hitbox class.
     * @param {Vector} corner1 - The first corner of the hitbox.
     * @param {Vector} corner2 - The opposite corner of the hitbox.
     * @param {Vector} position - The position of the object to which this hitbox belongs. (defaults to (0, 0))
     */
    constructor(corner1, corner2, position = new Vector(0, 0)) {
        this.offset1 = corner1;
        this.offset2 = corner2;
        this.position = position; // Use the provided position
    }

    /**
     * Updates the position of the hitbox.
     * @param {Vector} position - The new position of the object.
     */
    updatePosition(position) {
        this.position = position.copy();
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

export default Hitbox;