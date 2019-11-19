/*
Colider
*/
class Colision_Body{
    constructor(entity){
        this._entity = entity;          // Contains the owner.
        this._collisionTop = false;
        this._collisionBottom = false;
        this._collisionRight = false;
        this._collisionLeft = false;
    }
    checkEdges(layer) { // checks if it has reached a side of the colider.
        // check for collision on x axis
        if (this._entity.location.x > layer.width) {
            this.collisionRight = true;
        } else if (this._entity.location.x < 0) {
            this.collisionLeft = true;
        } else {
            this.collisionRight = false;
            this.collisionLeft = false;
        }

        // check for collisions on y axis
        if (this._entity.location.y > layer.height) {
            this.collisionBottom = true;
        }
        else if (this._entity.location.y < 0) {
            this.collisionTop = true;
        }
        else {
            this.collisionTop = false;
            this.collisionBottom = false;
        }
        
    }
    get collisionTop(){
        return this._collisionTop;
    }
    set collisionTop(value){
        this._collisionTop = value;
    }
    get collisionBottom(){
        return this._collisionBottom;
    }
    set collisionBottom(value){
        this._collisionBottom = value;
    }
    get collisionRight(){
        return this._collisionRight;
    }
    set collisionRight(value){
        this._collisionRight = value;
    }
    get collisionLeft(){
        return this._collisionLeft;
    }
    set collisionLeft(value){
        this._collisionLeft = value;
    }
    get entity(){
        return this._entity;
    }
}


class Entity extends GameObject{
    constructor(options){
        super(options);
        this.collisionBody = options.collisionBody;         // TODO: Think about doing it this way. Makes sence there are diffrent kinds of collision body's. Circle, Rect
        
    }
    get alive(){
        return this._alive;
    }
    set alive(value){
        this._alive = value;
    }
}


// will render itself and anithing inside itself. 
// should be used for anything that will take up the whole screen (For example: Game, Options menu, Menu, Loading screen)
class Scene{
    objects = [];
    update(){
        // remove all dead objects.
        for( let i = this.objects.length-1; i >= 0; i-- ){
            let object = this.objects[i];
            object.update();
            if (!object.alive) {
                this.objects.splice(i,1);
            }
        }
    }
    addObject(object){
        this.objects.push(object);
    }
}

class Game{
    constructor(options){
        this.canvas = options.canvas || {};
    }
}

class Button extends Sprite{
    constructor(options){
        super(options);
        this.disabled = options.disabled || false;
        this.state = {
            clicked:false,
            pressed:false,
            released:false,
            hover:false
        }
    }
}