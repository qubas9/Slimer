import { Vector,Event } from "./coretools.js"
import {EventMovingBlock,EventBlock,Block,Player,Entity,Sprite,MovingBlock,Physic, Render, GameLoop} from "./engine.js"

class LevelLoader{
    constructor({setings,pathPrefix,levelList}){
        if (setings){
            this.defaulSetings = setings
        }
        this.pathPrefix = pathPrefix || ""
        this.xmax = 0
        this.ymax = 0
        this.levelList = levelList
        Event.on("NextLevel",this.nextLevel.bind(this))
        Event.on("End",(() => {this.GameLoop.stop(); this.render.destroy();}).bind(this))
    }

    loadLevel(level){
        this.currentLevel = level.name || "unnamedLevel"
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
        let positions = {}
        let waitList = []
        if (level.grid){
            level.grid.forEach((array,i) => {
                if (array.length > this.xmax){this.xmax = array.length}
                if (i > this.ymax){this.ymax = i}
                array.forEach((e,j) => {
                    if(e){
                        if (setings[e]){
                            let element = {...setings[e]}
                            element.setings.onLoadCallback = this.elementLoaded.bind(this)
                            element.setings.y = i*setings.grid.size
                            element.setings.x = j*setings.grid.size
                            this.addElement(element)
                            this.numOfElements++
                        }else if(Array.isArray(e)){
                            let element = {...setings[e[0]]}
                             waitList.push([element,[e[1],i,j]])
                            

                        }else{
                            positions[e] = [i*setings.grid.size,j*setings.grid.size]
                        }
                    }
                })
            })
            waitList.forEach((element) => {
                element[0].setings.onLoadCallback = this.elementLoaded.bind(this)
                element[0].setings.starty = element[1][1]*setings.grid.size
                element[0].setings.startx = element[1][2]*setings.grid.size
                element[0].setings.endy = positions[element[1][0]] ? positions[element[1][0]][0] : element[1][1]*setings.grid.size
                element[0].setings.endx = positions[element[1][0]] ? positions[element[1][0]][1] : element[1][2]*setings.grid.size
                this.addElement(element[0])
                this.numOfElements++                  
            })
        }
        this.render.setCameraBoundres(this.xmax * setings.grid.size,(this.ymax+1) * setings.grid.size)
        this.waitToLoad(setings);
        }

    addElement(element){
        this.addGame(element.setings);
        switch (element.type) {
            case "block":
            new Block(element.setings);
            break;
            case "player":
            let p = new Player(element.setings);
            this.render.cameraFolow(p.position);
            break;
            case "entity":
            new Entity(element.setings);
            break;
            case "sprite":
            new Sprite(element.setings);
            break;
            case "movingBlock":
            new MovingBlock(element.setings);
            break;
            case "eventBlock":
            new EventBlock(element.setings);
            break;
            case "eventMovingBlock":
            new EventMovingBlock(element.setings);
            break;
            default:
                console.warn(`Unknown element type: ${element.type}`);
                break;
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
        let level = this.parseJSON(xhr.response)
        if (!level.name){
            level.name = url.replace(/^.*[\\/]/, "")
            level.name = level.name.split(".")[0]
        }
        this.loadLevel(level);
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
    nextLevel(){
        if (!this.levelList || !Array.isArray(this.levelList) || this.levelList.length === 0) {
            console.warn("Level list is missing or empty.");
            return;
        }
        if (!this.currentLevel || this.currentLevel === "unnamedLevel") {
            console.warn("Current level is not set or is unnamed.");
            return;
        }
        const currentLevelIndex = this.levelList.indexOf(this.currentLevel);
        if (currentLevelIndex === -1) {
            console.warn(`Current level '${this.currentLevel}' not found in level list.`);
            return;
        }
        const nextLevelIndex = (currentLevelIndex + 1);
        if (nextLevelIndex >= this.levelList.length) {
            Event.emit("NoMoreLevels");
            console.warn("No more levels available.");
            return;
        }
        this.currentLevel = this.levelList[nextLevelIndex];
        Event.emit("End");
        this.loadJSON(this.pathPrefix + this.currentLevel+".json");
    }
}

export default LevelLoader