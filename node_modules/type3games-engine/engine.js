import Render from "./render.js";
import Sprite from "./sprite.js";
import Physic from "./physic.js";
import GameLoop from "./gameloop.js";
import Block from "./blocks/block.js";
import MovingBlock from "./blocks/movingBlock.js";
import Entity from "./entities/entity.js"; 
import Player from "./entities/player.js";
import LevelLoader from "./levelLoader.js";
import EventBlock from "./blocks/eventBlock.js";
import EventMovingBlock from "./blocks/eventMovingBlock.js";

/**
 * @typedef {import('./render.js').default} Render
 * @typedef {import('./sprite.js').default} Sprite
 * @typedef {import('./physic.js').default} Physic
 * @typedef {import('./gameloop.js').default} GameLoop
 * @typedef {import('./blocks/block.js').default} Block
 * @typedef {import('./blocks/movingBlock.js').default} MovingBlock
 * @typedef {import('./entities/entity.js').default} Entity
 * @typedef {import('./levelLoader.js').default} LevelLoader
 * @typedef {import('./entities/player.js').default} Player
 */


export {
  LevelLoader,
  Player, 
  Entity,
  GameLoop,
  Sprite,
  Render,
  Block,
  Physic,
  MovingBlock,
  EventBlock,
  EventMovingBlock
};