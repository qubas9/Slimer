import {Vector} from "./coretools.js";

/**
* The Sprite class represents a visual element that can be drawn onto the canvas.
* Each sprite has its own position and image.
*/
class Sprite {
    /**
     * Creates an instance of the Sprite class.
     * @param {Object} options - An object containing the following properties:
     *   @property {number} x - The x-coordinate of the sprite's position.
     *   @property {number} y - The y-coordinate of the sprite's position.
     *   @property {string} imageSrc - The URL of the image to be displayed as the sprite.
     *   @property {number} width - The width of the sprite.
     *   @property {number} height - The height of the sprite.
     *   @property {Render} render - An instance of the Render class to which this sprite will be added.
     *   @property {Function} [onLoadCallback] - A callback function that is called when the image is loaded (optional).
     * @throws {Error} If any of the parameters are of incorrect types.
     */
    constructor(options) {
        const { x, y, imageSrc, width, height, render, onLoadCallback } = options;

        if (typeof x !== "number" || typeof y !== "number") {
            throw new Error("x and y must be numbers");
        }
        if (typeof width !== "number" || typeof height !== "number") {
            throw new Error("width and height must be numbers");
        }
        if (typeof imageSrc !== "string") {
            throw new Error("imageSrc must be a valid URL string");
        }
  
        this.position = new Vector(x, y); // The position of the sprite as a Vector
        this.width = width; // The width of the sprite,
        this.height = height; // The height of the sprite,
        this.image = new Image(); // Create a new image element
        this.loaded = false; // Flag to indicate if the image is loaded
        this.onLoadCallback = options.onLoadCallback; // Callback function to be called when the image is loaded
        // Handle image loading
        this.image.onload = () => {
            this.loaded = true;
            if (typeof this.onLoadCallback === "function") {
                this.onLoadCallback(); // Call the provided callback when the image is ready
            }
        };
       
  
        // Handle image loading errors
        this.image.onerror = () => console.error(`Error loading image: ${imageSrc}`);
  
        this.image.src = imageSrc; // Set the image source
      
        if (render && typeof render.addSprite === "function") {
            render.addSprite(this);
        } else {
            //console.log("Render was not provided or does not have an addSprite method. Skipping sprite addition.");
        }
    }
  }

export default Sprite;