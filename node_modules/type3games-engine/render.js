import { Vector } from "./coretools.js";
import {Sprite} from "./engine.js"; // Ensure Sprite is imported

/**
 * The Render class is responsible for handling the canvas rendering,
 * including drawing sprites and managing the background.
 */
class Render {
  /**
   * Creates an instance of the Render class.
   * @param {Object}
   * @property {number} width - The width of the canvas.(default window.innerWidth)
   * @property {number} height - The height of the canvas.(default window.innerHeight)
   * @property {Array} background - The background color of the canvas (RGB array). Default is light gray.
   */
  constructor({width, height, scale, background,camera ,cameraMinX,cameraMinY,cameraMaxX,cameraMaxY,debug}) {
      this.canvas = document.createElement("canvas");
      this.debug = debug |false
      this.camera = camera || new Vector(0,0)
      this.scale = scale
      this.canvas.width = width|| window.innerWidth;
      this.canvas.height = height||window.innerHeight;
      this.ctx = this.canvas.getContext("2d"); // Set the scale for the context
      this.background = background || [250,250,250]; // Background color
      this.sprites = []; // List of all sprites to render
      this.cameraMinX = cameraMinX
      this.cameraMaxX = cameraMaxX
      this.cameraMaxY = cameraMaxY
      this.cameraMinY = cameraMinY
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
     * @returns {Sprite} A new instance of the Sprite class.
    */
   makeSprite(x, y, imageSrc, width, height) {
       return new Sprite(x, y, imageSrc, width, height);
    }

    cameraFolow(vector){
        this.camera = vector
    }
    
    /**
     * Renders the canvas, including the background and all sprites.
     * This method is called to update the canvas every frame.
     * @param {Function} callback - A callback function that can be executed after rendering (optional).
    */
   render(callback) {
       // Fill the canvas with the background color
       // Reset current transformation matrix to the identity matrix
       this.ctx.setTransform(1, 0, 0, 1, 0, 0);
       this.ctx.scale(this.scale,this.scale); // Apply scaling to the context
       this.ctx.fillStyle = `rgb(${this.background[0]},${this.background[1]},${this.background[2]})`;
       this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

       let cy = -this.camera.y+(this.canvas.height/this.scale/2)
       let cx = -this.camera.x + (this.canvas.width/this.scale/2)
       cx = cx < this.cameraMinX ? this.cameraMinX : cx
       cx = cx > this.cameraMaxX ? this.cameraMaxX : cx
       cy = cy < this.cameraMinY ? this.cameraMinY : cy
       cy = cy > this.cameraMaxY ? this.cameraMaxY : cy 
       console.log("cam",cx," ",cy);
       
       this.ctx.translate(cx,cy)
      // Draw each sprite if the image is loaded and valid
      for (let sprite of this.sprites) {
          if (sprite.loaded && sprite.image) { // Ensure the image is valid and loaded
              this.ctx.drawImage(sprite.image, sprite.position.x, sprite.position.y, sprite.width, sprite.height);
            }
            if (!this.debug) {continue}
            if (sprite.hitbox) {
                // Draw the hitbox for debugging purposes
                this.ctx.strokeStyle = "red"; // Set hitbox color to red
                this.ctx.lineWidth = 0.1; // Set hitbox line width
                this.ctx.strokeRect(sprite.hitbox.position.x + sprite.hitbox.offset1.x , sprite.hitbox.position.y +sprite.hitbox.offset1.y,sprite.hitbox.offset2.x,sprite.hitbox.offset2.y);
            }
      }
        // Execute the callback function if provided
        if (typeof callback === "function") {
            callback();
        }
  }
}



export default Render;
