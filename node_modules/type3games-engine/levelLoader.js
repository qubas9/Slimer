import { Vector } from "./coretools.js"
import {Block,Player,Entity,Sprite,MovingBlock,Physic, Render, GameLoop} from "./engine.js"

class LevelLoader{
    constructor(setings,pathPrefix){
        if (setings){
            this.defaulSetings = setings
        }
        this.pathPrefix = pathPrefix || ""
    }

    loadLevel(level){
        let setings
        if(level.setings == "default" && this.defaulSetings){
            setings = this.defaulSetings
        }else{
            setings = level.setings
        }

        for(let element in setings){
            if(!setings[element].setings || !setings[element].setings.imageSrc){continue}
            setings[element].setings.imageSrc = this.pathPrefix + setings[element].setings.imageSrc
        }

        this.physic = new Physic()
        this.render = new Render(setings.render || {with: 200, height: 200, scale:1})
        this.elemetsLoaded = []
        this.numOfElements = 0
        this.grid

        if (level.grid){
            level.grid.forEach((array,i) => {
                // if (array.length > this.maxX)
                array.forEach((e,j) => {
                    if(e){
                        if (!setings[e]){throw new Error("Element is not in setings")}
                        let element = {...setings[e]}
                        element.setings.onLoadCallback = this.elementLoaded.bind(this)
                        element.setings.y = i*setings.grid.size
                        element.setings.x = j*setings.grid.size
                        this.addElement(element)
                        this.numOfElements++
                    }
                })
            });
        }
        this.waitToLoad(setings);
        }

    addElement(element){
        if (element.type == "block"){
            this.addGame(element.setings)
            new Block(element.setings)
        }else if (element.type == "player"){
            this.addGame(element.setings)
            let p = new Player(element.setings)
            this.render.cameraFolow(p.position)
        }else if (element.type == "entity"){
            this.addGame(element.setings)
            new Entity(element.setings)
        }else if (element.type == "sprite"){
            this.addGame(element.setings)
            new Sprite(element.setings)
        }else if (element.type == "movingBlock"){
            this.addGame(element.setings)
            new MovingBlock(element.setings)
        }
    }

    elementLoaded(){
        this.elemetsLoaded.push(true)
    }

    parseJSON(json){
        let obj = JSON.parse(json)
        if (obj.setings == "default"){return obj}
        for (let element in obj.setings){
            if(!obj.setings[element].setings){continue}
            for(let parameter in obj.setings[element].setings){
                if(obj.setings[element].setings[parameter].x != undefined && obj.setings[element].setings[parameter].y != undefined){
                    obj.setings[element].setings[parameter] = new Vector(obj.setings[element].setings[parameter].x,obj.setings[element].setings[parameter].y)
                }
            }
        }
        return obj
    }

  
    loadJSON(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.pathPrefix + url, true);
        let callback = ()  => {
        if (xhr.status === 200) {
            
        this.loadLevel(this.parseJSON(xhr.response));
        } else {
        throw new Error(`Chyba ${xhr.status} při načítání ${url}`);
        }
  }
        xhr.onload = callback.bind(this) ;

  xhr.onerror = function () {
    callback('Síťová chyba', null);
  };

  xhr.send();
}

loadDefaultFromJSON(url){
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.pathPrefix + url, true);
        let callback = ()  => {
        if (xhr.status === 200) {
            
        this.defaulSetings = this.parseJSON(xhr.response).setings
        } else {
        throw new Error(`Chyba ${xhr.status} při načítání ${url}`);
        }
  }
        xhr.onload = callback.bind(this) ;

  xhr.onerror = function () {
    callback('Síťová chyba', null);
  };

  xhr.send();
    }

    addGame(setings){
        setings.physic = this.physic
        setings.render = this.render
        return setings
    }

    waitToLoad(setings) {
            if(this.numOfElements != this.elemetsLoaded.length) {
                 window.setTimeout(this.waitToLoad.bind(this,setings), 100); /* this checks the flag every 100 milliseconds*/
            } else {
            /* do something*/
            setings.GameLoop = this.addGame(setings.GameLoop || {fps:60,physic:{},render:{}})
            this.GameLoop = new GameLoop(setings.GameLoop)
            this.GameLoop.start()
            }
          }
}

export default LevelLoader