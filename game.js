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
    }

    /**
     * Adds a new physics object and a linked sprite to the game.
     * @param {number} x - The initial x-coordinate of the physics object.
     * @param {number} y - The initial y-coordinate of the physics object.
     * @param {string} spriteSrc - The URL of the sprite image.
     * @param {number} spriteWidth - The width of the sprite.
     * @param {number} spriteHeight - The height of the sprite.
     * @param {number} scale - The scale factor for the sprite (default is 1).
     * @param {number} mass - The mass of the physics object (default is 1).
     * @param {number} g - The gravity for the physics object (default is the global gravity).
     * @param {number} restitution - The restitution (bounciness) of the object (default is 1).
     * @param {number} drag - The drag coefficient of the object (default is the global drag).
     * @param {boolean} hitbox - Whether the physics object should have a hitbox (default is true).
     * @returns {Object} The created sprite and its associated physics object ID.
     */
    addPhysicsObjectWithSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale = 1, mass = 1, g = this.g, restitution = 1, drag = this.drag, hitbox = true) {
        
        // Create a hitbox if not provided
        if (hitbox === true) {
            hitbox = this.physic.makeHitbox(0, 0, spriteWidth * scale, spriteHeight * scale);
        }

        // Create physics object
        let objectId = this.physic.addObj(x, y, hitbox, mass, g, drag, restitution);
        
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
     */
    addFreeSprite(x, y, spriteSrc, spriteWidth, spriteHeight, scale = 1) {
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
     * Starts the game by running the game loop.
     */
    start() {
        this.gameLoop();
    }
}

// Usage Example:

// Create game instance
let game = new Game(800, 600, 0.1, 1, [0, 0, 0]);

// Create physics objects with linked sprites
let { sprite: sprite1, objectId: objectId1 } = game.addPhysicsObjectWithSprite(100, 400, "./Slimer.png", 20, 20, 4, 100, -0.1, 0, 0.9);
let { sprite: sprite2, objectId: objectId2 } = game.addPhysicsObjectWithSprite(100, 200, "./Slimer.png", 20, 20, 4, 100, -0.1, 0, 0.9);
let { sprite: sprite3, objectId: objectId3 } = game.addPhysicsObjectWithSprite(100, 300, "./Slimer.png", 20, 20, 4, 100, -0.1, 0, 0.9);
let { sprite: sprite4, objectId: objectId4 } = game.addPhysicsObjectWithSprite(100, 100, "./Slimer.png", 20, 20, 4, 100, 0.1, 0, 0.9);

// Create a free-floating sprite (not linked to any physics object)
let freeSprite = game.addFreeSprite(400, 200, "./Slimer.png", 20, 20, 4);

// Start the game loop
game.start();
