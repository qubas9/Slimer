import { Control } from "../coretools.js";
import { Vector } from "../coretools.js";
import{ Entity } from "../engine.js";
/**
 * Represents a player entity that can be controlled and interact with the game environment.
 * @extends Entity
 */
class Player extends Entity {
    /**
     * Constructs a new Player instance.
     * @param {Object} input - An object containing various properties to configure the player.
     * @param {number} input.x - The initial x-coordinate of the player.
     * @param {number} input.y - The initial y-coordinate of the player.
     * @param {string} input.imageSrc - The URL or path to the image representing the player.
     * @param {number} input.width - The width of the player's sprite.
     * @param {number} input.height - The height of the player's sprite.
     * @param {Function} input.render - A function to render the player on the canvas.
     * @param {Object} input.physic - An object containing physical properties like mass, friction, etc.
     * @param {Vector} input.gravity - The gravity vector affecting the player (default is 500).
     * @param {Function} input.onLoadCallback - A callback function to be executed when the player's sprite is loaded.
     * @param {Object} input.callBackMap - An object mapping control keys to functions.(optional)
     * @param {number} input.onClickAcceleration - The acceleration applied to the player when moving left or right.
     * @param {number} input.inAirDrag - The drag aplyed when complitly in air
     * @param {number} input.jumpAcceleration - The acceleration applied to the player when jumping.
     */
    constructor(input) {
        super(input);
        /**
         * @type {Control}
         */
        this.controls = new Control(this, input.callBackMap); // Initialize controls for the player
        this.onClickAcceleration = input.onClickAcceleration;
        this.dragCorectionAplied = false
        this.maxXSpeed = input.maxXSpeed
        this.maxBoost = input.maxBoost
        this.jumpAcceleration = input.jumpAcceleration; // Set the jump acceleration
        this.controls.bind("left", "a", this.left);
        this.controls.bind("right", "d", this.right);
        this.controls.bind("jump", "w", this.jump);
        // this.controls.bind("down","ArrowDown" ,this.down);
        this.controls.bindOnce("start", "s", this.controls.startRecording.bind(this.controls));
        this.controls.bindOnce("stop", "q", () => { console.log(JSON.stringify(this.controls.stopRecording())); });
       // let recording = prompt("Enter recorded events JSON:")
        // if (recording != "") {
        //     this.controls.startPlayback(JSON.parse(recording));
        // }
    }

    /**
     * Applies a leftward acceleration to the player.
     * @param {Player} This - The current Player instance.
     */
    left(This) {
        if (This.touching[0]/*&& !This.dragCorectionAplied*/){
            This.dragCorectionAplied = true
            This.touching.forEach((block) => {
                //console.log("right");
                if (This.velocity.x < 0){
                    This.velocity.x /= block.friction
                }
        })
    }
    This.addAcceleration(new Vector(-This.onClickAcceleration, 0)); // Move left
    }

    /**
     * Applies a rightward acceleration to the player.
     * @param {Player} This - The current Player instance.
     */
    right(This) {
        
        if (This.touching[0]/*&& !This.dragCorectionAplied*/){
            This.dragCorectionAplied = true
        This.touching.forEach((block) => {
                //console.log("right");
                if (This.velocity.x > 0){
                    This.velocity.x /= block.friction
                }
        })
    }
    if (Math.abs(This.velocity.x) < This.maxXSpeed){
        This.addAcceleration(new Vector(This.onClickAcceleration, 0)); // Move right
    }   
    }

    /**
     * Applies an upward velocity to the player if it is on the ground, causing a jump.
     * @param {Player} This - The current Player instance.
     */
    jump(This) {
        if (This.onGround) {
            This.addVelocity(new Vector(0, -This.jumpAcceleration)); // Jump with a velocity upwards
            This.onGround = false; // Set onGround to false after jumping
        }
    }

    /**
     * Applies a downward acceleration to the player.
     * @param {Player} This - The current Player instance.
     */
    down(This) {
        This.addAcceleration(new Vector(0, This.onClickAcceleration)); // Move down
    }
    /**
     * Updates the player's state and controls based on the elapsed time.
     * @override
     * @param {number} deltaTime - The time elapsed since the last update in milliseconds.
     */
    update(deltaTime) {
        this.dragCorectionAplied = false
       super.update(deltaTime); // Call the parent class's update method
         // Update controls
    }

    afterUpdate(deltaTime){
        this.controls.update(deltaTime);
    }
}

export default Player;