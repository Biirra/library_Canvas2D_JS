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



// TODO: Implement choose to repaint. in case of backgrounds that dont need repaint.
class Layer {
    constructor(canvas, FPS){
        this.FPS = 1000 / FPS;
        this.canvas = canvas;
        this.context2D = canvas.getContext("2d");
        this.inputListener = new InputListener(canvas); // TODO: Should be atleast 1 more level higher.
        this.gameObjects = [];
    }
    run() {
        let desiredTime = Date.now() + this.FPS;
        this.update();
        this.render();
        let interval = Math.max(0, desiredTime-Date.now());
        setTimeout(this.run.bind(this), interval);
    }
    update() {
        for(let i = 0; i < this.gameObjects.length; i++){
            let obj = this.gameObjects[i];
            obj.update(this.inputListener);
        }
    }     
    render() {
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.gameObjects.length; i++){
            let obj = this.gameObjects[i];
            obj.render(this.context2D);
        }
    }
}

class UIObject{
    constructor(){
        this.clicked    = false;
        this.hovered    = false;
    }
    intersects(obj, mouse) {
        let xIntersect = mouse.location.x  > obj.location.x && mouse.location.x  < obj.location.x + obj.width;
        let yIntersect = mouse.location.y  > obj.location.y && mouse.location.y  < obj.location.y + obj.height;
        return  xIntersect && yIntersect;
    }
    update(input){
        if (this.intersects(this.sprite.body, input.mouse)) {
            this.hovered = true;
            if (input.mouse.clicked) {
                this.clicked = true;
            }
        } else {
            this.hovered = false;
        }
 
        if (!input.mouse.down) {
            this.clicked = false;
        }               
    }
};

class Button extends UIObject{
    constructor(options) {
        super();
        this.sprite     = options.sprite;
    }
    update(input) {
        var wasNotClicked = !this.clicked;
        super.update(input);

        if (this.clicked && wasNotClicked) {
            this.onClick();
        }
        if(this.hovered){
            this.onHover();
        }
    }
    onHover(){
        //console.log("This function can be overwritten with onHover().");
    }
    onClick(){
        console.log("This function can be overwritten with onClick().")
    }
    render(ctx) {
        this.sprite.render(ctx);
    }
}
