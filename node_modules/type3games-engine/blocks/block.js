
import { Sprite } from "../engine.js"; // Ensure this matches the export in sprite.js
import { Hitbox } from "../coretools.js";
import { Vector } from "../coretools.js";
    /**
     * Creates an instance of the Block class.
     * @param {Object} options - An object containing the properties for the block.
     * @param {number} options.x - The x-coordinate of the block.
     * @param {number} options.y - The y-coordinate of the block.
     * @param {string} options.imageSrc - The URL of the image for the block.
     * @param {number} options.width - The width of the block.
     * @param {Render} options.render - An instance of the Render class to which this block will be added(optionat).
     * @param {Object} options.physic - An object containing the physics properties for the block (optional).
     * @param {number} [options.friction=0.99] - The friction coefficient for the block (default is 0.99).
     * @param {Function} [options.onLoadCallback] - A callback function that is called when the image is loaded (optional).
     */
class Block extends Sprite {
    constructor({ x, y, imageSrc, width, height, render, physic, friction = 0.99, onLoadCallback }) {
        super({ x, y, imageSrc, width, height, render, onLoadCallback });
        this.friction = friction; // Default friction if not provided
        this.hitbox = new Hitbox(new Vector(0, 0), new Vector(width, height), this.position);
        if (physic && typeof physic.addBlock === "function") {
            physic.addBlock(this); // Assuming physic is an instance of a class that manages physics
        } else {
            //console.log("physic is not defined or does not have an addBlock method.");
        }
    }
    /**
     * @description Aplly block specific behavior to entity.
     * @param {Entity} entity - The entity the behavior is apllyed.
     * @param {Vector} direction - The direction of the collision (optional).
     */ 
    onCollision(entity,direction) {
        let bufer = Math.abs(direction.y);
        direction.y = Math.abs(direction.x);
        direction.x = bufer;//wap x and y to ensure correct direction handling
        //console.log("v"+entity.velocity.mag+" "+entity.velocity.x+" "+entity.velocity.y);
        // if (entity.velocity.mag < 0.01){
        //     entity.velocity = new Vector(0,0); // Reset entity's velocity on collision
        // }else{

            entity.velocity.multTogether(direction); // Reset entity's velocity on collision
        // }
        //console.log("v"+entity.velocity.x+" "+entity.velocity.y);
        
    }
    /**
     * Updates the block's position and hitbox.
     * @param {number} deltaTime - The time elapsed since the last update (in seconds).
     */
    touching(entity) {
        entity.velocity.mult(this.friction); // Call the onCollision method to apply the block's specific behavior
    }
}

export default Block; // Ensure Block is exported as default