# Example Usage

This example demonstrates how to create a simple game using the Slimer Game Engine.

## Steps

1. **Initialize the Game**  
   Create a new `Game` instance:
   ```javascript
   import Game from './game.js';

   const game = new Game(800, 600, 0.1, 1, [0, 0, 0]);
   ```

2. **Add Sprites and Physics Objects**  
   Add a physics object with a linked sprite:
   ```javascript
   const { sprite, objectId } = game.addPhysicsObjectWithSprite(
       100, 400, './sprite.png', 50, 50, 1, 10, 0.1, 0.8, 0.9, true, "soft", 0.5, 0.01
   );
   ```

3. **Start the Game Loop**  
   Start the game loop to render and update the game:
   ```javascript
   game.start();
   ```

4. **Add Controls**  
   Use the `Control` module to bind keys to actions:
   ```javascript
   import Control from './controls.js';

   const controls = new Control({ obj: game.physic.PhObjectList[objectId] });
   controls.bind('moveRight', 'ArrowRight', (obj) => {
       obj.applyForce(new Vector(5, 0));
   });
   ```

## Full Example

```javascript
import Game from './game.js';
import Control from './controls.js';
import Vector from './vector.js';

const game = new Game(800, 600, 0.1, 1, [0, 0, 0]);

const { sprite, objectId } = game.addPhysicsObjectWithSprite(
    100, 400, './sprite.png', 50, 50, 1, 10, 0.1, 0.8, 0.9, true, "soft", 0.5, 0.01
);

const controls = new Control({ obj: game.physic.PhObjectList[objectId] });
controls.bind('moveRight', 'ArrowRight', (obj) => {
    obj.applyForce(new Vector(5, 0));
});

game.start();
```
