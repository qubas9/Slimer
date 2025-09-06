import { Vector } from "../coretools.js";
import { Block } from "../engine.js";

class MovingBlockConfig {
    constructor(startx, starty, endx, endy, routeTime, imageSrc, width, height, render, physic, friction = 0.99, onLoadCallback) {
        this.startx = startx;
        this.starty = starty;
        this.endx = endx;
        this.endy = endy;
        this.routeTime = routeTime;
        this.imageSrc = imageSrc;
        this.width = width;
        this.height = height;
        this.render = render;
        this.physic = physic;
        this.friction = friction;
        this.onLoadCallback = onLoadCallback;
    }
}

class MovingBlock extends Block {
    /**
     * Creates an instance of the MovingBlock class.
     * @param {MovingBlockConfig} config - Configuration object for creating a MovingBlock.
     */
    constructor(config) {
        super({
            x: config.startx,
            y: config.starty,
            imageSrc: config.imageSrc,
            width: config.width,
            height: config.height,
            render: config.render,
            physic: config.physic,
            friction: config.friction,
            onLoadCallback: config.onLoadCallback
        });
        this.endx = config.endx;
        this.endy = config.endy;
        this.routeTime = config.routeTime;

        // Calculate the velocity vector based on start and end positions and route time
        this.velocity = new Vector((config.endx - config.startx) / config.routeTime, (config.endy - config.starty) / config.routeTime);

        // Store the starting position
        this.start = this.position.copy();

        // Store the end position
        this.end = new Vector(config.endx, config.endy);

        // Allowable error for reaching the end
        this.exeptedError = 0.00000000000000000000001;
        config.physic.addUpdatable(this)
    }
    update(deltaTime) {
        this.justTurned = false; // Reset the justTurned flag at the start of each update
        this.deltaTime = deltaTime; // Store the delta time for use in other methods
        this.exeptedError = this.deltaTime / 1000;
        this.position.add(Vector.mult(this.velocity,deltaTime));
        this.hitbox.updatePosition(this.position);
        //console.log(`MovingBlock position: ${this.position.x}, ${this.position.y}`);
        //console.log(`MovingBlock velocity: ${this.velocity.x}, ${this.velocity.y}`);
        //console.log(`MovingBlock end: ${this.end.x}, ${this.end.y}`);
        
        // Check if the block has reached the end of its path
        if (Vector.sub(this.position, this.end).mag + this.exeptedError < Vector.mult(this.velocity,deltaTime).mag || Vector.sub(this.position, this.start).mag + this.exeptedError < Vector.mult(this.velocity,deltaTime).mag) {
            // Reverse the velocity to move back to the start
            this.justTurned = true; // Set a flag to indicate the block has just turned
            this.velocity.mult(-1);
        }
    }

    touching(entity) {
        let velocity = Vector.sub(entity.velocity,this.velocity);
        velocity.mult(this.friction); // Apply friction to the entity's 
        entity.velocity=Vector.add(this.velocity,velocity); // Update the entity's velocity with the modified velocity
    }

    onCollision(entity, direction) {
        super.onCollision(entity, direction.copy()); // Call the parent class's onCollision method
       if (entity.velocity.mag+this.exeptedError < this.velocity.mag ) {

           entity.velocity.add(this.velocity); // Add the block's velocity to the entity's velocity
       }

        // Call the touching method to apply the block's specific behavior
        this.touching(entity);
    }
}
export default MovingBlock; // Ensure MovingBlock is exported as default