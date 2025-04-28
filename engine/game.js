import Render from "./render.js";
import Physic from "./physic.js";

/**
 * The Game class is responsible for managing the overall game flow,
 * including rendering, physics updates, and handling objects (sprites).
 */
class Game {
    /**
     * Creates an instance of the Game class.
     * @param {number} width - The width of the game canvas.
     * @param {number} height - The height of the game canvas.
     * @param {number} gravity - The gravity constant for physics (default is 0).
     * @param {number} drag - The drag constant for physics (default is 1).
     * @param {Array} background - The background color of the game canvas as an RGB array (default is light gray).
     */
    constructor(width, height, gravity = 0, drag = 1, background = [250, 250, 250]) {
        this.physic = new Physic(gravity, drag); // Physics engine instance
        this.render = new Render(width, height, background); // Renderer instance
        this.spriteToPhysics = []; // Map to link sprites to physics objects
        this.inGameLoop = []; // List of functions to be called in the game loop
    }

    /**
     * Adds a new physics object and a linked sprite to the game.
     * @param {number} x - The initial x-coordinate of the physics object.
     * @param {number} y - The initial y-coordinate of the physics object.
     * @param {string} spriteSrc - The URL of the sprite image.
     * @param {number} spriteWidth - The width of the sprite.
     * @param {number} spriteHeight - The height of the sprite.
     * @param {number} scale - The scale factor for the sprite (default is 1).
     * @param {number|boolean} mass - The mass of the physics object (default is 1). For unmovable objects, pass `true`.
     * @param {number} g - The gravity for the physics object (default is the global gravity).
     * @param {number} restitution - The restitution (bounciness) of the object (default is 1).
     * @param {number} drag - The drag coefficient of the object (default is the global drag).
     * @param {boolean|Hitbox} hitbox - If `true`, generates a hitbox from the sprite size; otherwise, a custom hitbox can be passed (default is `true`).
     * @param {string} colisionType - Type of collision ("soft" or "hard", default is "hard").
     * @param {number} softCollisionPercent - Percentage of soft collision (default is 0.5).
     * @param {number} softCollisionSlop - Slop for soft collision (default is 0.01).
     * @returns {Object} The created sprite and its associated physics object ID.
     * @throws {Error} If any parameter is of an incorrect type.
     */
    addPhysicsObjectWithSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale = 1, mass = 1, g = this.physic.g, restitution = 1, drag = this.physic.drag, hitbox = true, colisionType = "hard", softCollisionPercent = 0.5, softCollisionSlop = 0.01) {
        if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("x and y must be numbers");
        }
        if (typeof spriteSrc !== "string") {
            throw new Error("spriteSrc must be a string");
        }
        if (typeof spriteWidth !== "number" || typeof spriteHeight !== "number") {
            throw new Error("spriteWidth and spriteHeight must be numbers");
        }
        if (typeof scale !== "number") {
            throw new Error("scale must be a number");
        }
        if (typeof mass !== "number" && mass !== true) {
            throw new Error("mass must be a number or true for unmovable objects");
        }
        if (typeof g !== "number") {
            throw new Error("g must be a number");
        }
        if (typeof restitution !== "number") {
            throw new Error("restitution must be a number");
        }
        if (typeof drag !== "number") {
            throw new Error("drag must be a number");
        }
        if (typeof colisionType !== "string") {
            throw new Error("colisionType must be a string");
        }
        if (typeof softCollisionPercent !== "number") {
            throw new Error("softCollisionPercent must be a number");
        }
        if (typeof softCollisionSlop !== "number") {
            throw new Error("softCollisionSlop must be a number");
        }

        // Create a hitbox if not provided
        if (hitbox === true) {
            hitbox = this.physic.makeHitbox(0, 0, spriteWidth * scale, spriteHeight * scale);
        }else if (!(hitbox instanceof Hitbox)) {
            throw new Error("hitbox must be a Hitbox or true");
        }

        // Create physics object
        let objectId = this.physic.addObj(x, y, hitbox, mass, g, drag, restitution, colisionType, softCollisionPercent, softCollisionSlop);
        
        // Create the linked sprite
        let sprite = this.render.makeSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale, () => {
            this.render.render(); // Render when the image is loaded
        });
        
        // Link sprite to the physics object using spriteToPhysics map
        this.spriteToPhysics[objectId] = sprite;

        // Add the sprite to the renderer
        this.render.addSprite(sprite);

        return { sprite, objectId };
    }

    /**
     * Adds a free-floating sprite that is not linked to any physics object.
     * @param {number} x - The initial x-coordinate of the sprite.
     * @param {number} y - The initial y-coordinate of the sprite.
     * @param {string} spriteSrc - The URL of the sprite image.
     * @param {number} spriteWidth - The width of the sprite.
     * @param {number} spriteHeight - The height of the sprite.
     * @param {number} scale - The scale factor for the sprite (default is 1).
     * @returns {Sprite} The created free-floating sprite.
     * @throws {Error} If any parameter is of an incorrect type.
     */
    addFreeSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale = 1) {
        if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("x and y must be numbers");
        }
        if (typeof spriteSrc !== "string") {
            throw new Error("spriteSrc must be a string");
        }
        if (typeof spriteWidth !== "number" || typeof spriteHeight !== "number") {
            throw new Error("spriteWidth and spriteHeight must be numbers");
        }
        if (typeof scale !== "number") {
            throw new Error("scale must be a number");
        }

        let sprite = this.render.makeSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale, () => {
            this.render.render(); // Render when the image is loaded
        });

        // Add the sprite to the renderer
        this.render.addSprite(sprite);

        return sprite;
    }

    /**
     * The game loop that updates the physics engine, updates sprite positions,
     * and renders the updated scene.
     */
    gameLoop() {
        // Call all functions added to the game loop
        for (let entry of this.inGameLoop) {
            entry.func();
        }
        // Update the physics engine
        this.physic.update();

        // Update sprite positions based on their linked physics objects
        for (let sprite of this.spriteToPhysics) {
            // Update sprite position to match the corresponding physics object
            let phObj = this.physic.PhObjectList[this.spriteToPhysics.indexOf(sprite)];
            sprite.x = phObj.position.x;
            sprite.y = phObj.position.y;
        }

        // Render the updated scene
        this.render.render();

        // Request the next frame
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Adds a callback function to be executed in the start of the game loop.
     * @param {Function} func - The function to be executed in the game loop.
     * @returns {Symbol} A unique identifier for the added function.
     * This identifier can be used to remove the function later.
     */
    addToGameLoop(func) {
        const id = Symbol(); // Create a unique identifier
        this.inGameLoop.push({ id, func });
        return id; // Return the identifier for later removal
    }
    
    /**
     * Removes a callback function from the game loop using its identifier.
     * @param {Symbol} id - The unique identifier of the function to be removed.
     */
    removeFromGameLoop(id) {
        const index = this.inGameLoop.findIndex(entry => entry.id === id);
        if (index > -1) {
            console.log("Removing function from game loop with id:", id);
            this.inGameLoop.splice(index, 1);
        }
    }
     
    /**
     * Starts the game by running the game loop.
     */
    start() {
        this.gameLoop();
    }
}

export default Game;