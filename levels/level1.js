import Game from "../engine/game.js";

const game = new Game(500,500,0.1,0.8,[200,200,50]);
console.log(game)

let {sprite, PhObjectID} = game.addPhysicsObjectWithSprite(100,100,"../assets/Slimer.png",10,10,10,1,0.1,1,0.8,true);
game.start()