/*
Some predifined forces to be used.
*/
class Forces{
    constructor(){}
    //winds
    static get breeze(){
        return new Vector2d();
    }
    static get wind(){
        return new Vector2d(0.01,0);
    }
    static get windy(){
        return new Vector2d();
    }
    static get storm(){
        return new Vector2d();
    }
    static get friction(){
        return new Vector2d();
    }
    static get resistanceWater(){
        return new Vector2d();
    }
    static get resistanceAir(){
        return new Vector2d();
    }
    static get gravity(){
        return new Vector2d(0,0.1);
    }
}

/*
Colider
*/
class Colider2d{
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
        return this.entity;
    }
}
/*
TODO: Add way to rotate object.
*/
class Entity extends Sprite{
    alive = true;   // false = mark for deletion.
    constructor(options){
        super(options);
        this._velocity = options.velocity || Vector2d.zero;
        this._acceleration = options.acceleration || Vector2d.zero;

        this._aVelocity = 0;        // Angular velocity.
        this._aAcceleration = 0;    // Angular acceleration.

        this.mass = options.mass || 1;
    }
    update(){
        super.update();
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);

        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity; 
        this.aAcceleration = 0;
    }
    /**
     * Add a force to the object that influenses the location of this object.
     * @param {Vector2d} force The force applied to the acceleration of the object.
     */
    applyForce(force){
        let f = Vector2d.div(force, this.mass);
        this.acceleration.add(f);
    }
    applySpin(number){
        this.aAcceleration += number;
    }
    get aAcceleration(){
        return this._aAcceleration;
    }
    set aAcceleration(number){
        this._aAcceleration = number;
    }
    get aVelocity(){
        return this._aVelocity;
    }
    set aVelocity(number){
        this._aVelocity = number;
    }
    set acceleration(vector2d){
        this._acceleration = vector2d;
    }
    get acceleration(){
        return this._acceleration;
    }
    set velocity(vector2d){
        this._velocity = vector2d;
    }
    get velocity(){
        return this._velocity;
    }
    kill(){
        this.alive = false;
    }
}

class Mover extends Entity{
    constructor(options){
        super(options);
    }
    update(){
        super.update();
        this.angle = Math.atan2(this.velocity.y,this.velocity.x);
    }
}
class Oscillator extends Entity{
    constructor(options){
        super(options);
        this.r = 75;
        this.theta = 0;
        this.amplitude = 100;
        this.period = 120;
    }
    draw(){
        let offsetCenterX = this.width / 2;
        let offsetCenterY = this.height / 2;

        let x = this.r * Math.cos(this.theta);
        //let x = this.amplitude * Math.cos((Math.PI*2) * this._tickCount / this.period);
        let y = this.r * Math.sin(this.theta);
        //let y = this.amplitude * Math.cos((Math.PI*2) * this._tickCount / this.period);

        this.context.translate(this.location.x+offsetCenterX, this.location.y+offsetCenterY);
        this.context.beginPath();
        this.context.ellipse(x+this.width/2, y+this.height/2, this.width, this.height, this.angle, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.translate(-(this.location.x+offsetCenterX), -(this.location.y+offsetCenterY));
        this.theta += 0.01;
    }
}