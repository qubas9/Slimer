/**
 * The Render class is responsible for handling the canvas rendering,
 * including drawing sprites and managing the background.
 */
class Render {
  /**
   * Creates an instance of the Render class.
   * @param {number} width - The width of the canvas.
   * @param {number} height - The height of the canvas.
   * @param {Array} background - The background color of the canvas (RGB array). Default is light gray.
   */
  constructor(width, height, background = [250, 250, 250]) {
      this.canvas = document.createElement("canvas");
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext("2d");
      this.sprites = []; // List of all sprites to render
      this.background = background; // Background color
      document.body.appendChild(this.canvas);
  }

  /**
   * Adds a sprite to the list of sprites to be rendered.
   * @param {Sprite} sprite - An instance of the Sprite class to be added.
   * @throws {Error} If the sprite is not an instance of the Sprite class.
   */
  addSprite(sprite) {
      if (!(sprite instanceof Sprite)) {
          throw new Error("sprite must be an instance of Sprite");
      }
      this.sprites.push(sprite);
  }

  /**
   * Creates a new sprite.
   * @param {number} x - The x-coordinate of the sprite.
   * @param {number} y - The y-coordinate of the sprite.
   * @param {string} imageSrc - The URL of the image for the sprite.
   * @param {number} width - The width of the sprite.
   * @param {number} height - The height of the sprite.
   * @param {number} scale - The scaling factor for the sprite (default is 1).
   * @returns {Sprite} A new instance of the Sprite class.
   */
  makeSprite(x, y, imageSrc, width, height, scale = 1) {
      return new Sprite(x, y, imageSrc, width, height, scale);
  }

  /**
   * Renders the canvas, including the background and all sprites.
   * This method is called to update the canvas every frame.
   */
  render() {
      // Fill the canvas with the background color
      this.ctx.fillStyle = `rgb(${this.background[0]},${this.background[1]},${this.background[2]})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw each sprite if the image is loaded
      for (let sprite of this.sprites) {
          if (sprite.loaded) {
              this.ctx.drawImage(sprite.image, sprite.x, sprite.y, sprite.width, sprite.height);
          }
      }
  }
}

/**
* The Sprite class represents a visual element that can be drawn onto the canvas.
* Each sprite has its own position, image, and scale.
*/
class Sprite {
  /**
   * Creates an instance of the Sprite class.
   * @param {number} x - The x-coordinate of the sprite.
   * @param {number} y - The y-coordinate of the sprite.
   * @param {string} imageSrc - The URL of the image for the sprite.
   * @param {number} width - The width of the sprite.
   * @param {number} height - The height of the sprite.
   * @param {number} scale - The scaling factor for the sprite (default is 1).
   * @param {Function} onLoadCallback - A callback function that is called when the image is loaded (optional).
   * @throws {Error} If any of the parameters are of incorrect types.
   */
  constructor(x, y, imageSrc, width, height, scale = 1, onLoadCallback) {
      if (typeof x !== "number" || typeof y !== "number") {
          throw new Error("x and y must be numbers");
      }
      if (typeof width !== "number" || typeof height !== "number") {
          throw new Error("width and height must be numbers");
      }
      if (typeof imageSrc !== "string") {
          throw new Error("imageSrc must be a valid URL string");
      }

      this.x = x; // The x-coordinate of the sprite
      this.y = y; // The y-coordinate of the sprite
      this.scale = scale; // The scaling factor
      this.width = width * this.scale; // The width of the sprite, adjusted by scale
      this.height = height * this.scale; // The height of the sprite, adjusted by scale
      this.image = new Image(); // Create a new image element
      this.loaded = false; // Flag to indicate if the image is loaded

      // Handle image loading
      this.image.onload = () => {
          this.loaded = true;
          if (typeof onLoadCallback === "function") {
              onLoadCallback(); // Call the provided callback when the image is ready
          }
      };

      // Handle image loading errors
      this.image.onerror = () => console.error(`Error loading image: ${imageSrc}`);

      this.image.src = imageSrc; // Set the image source
  }
}

export default Render;
