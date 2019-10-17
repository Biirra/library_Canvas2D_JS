

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
TODO: Add way to rotate object.
*/
class Entity extends Sprite{
    constructor(options){
        super(options);
        this._velocity = options.velocity || Vector2d.zero;
        this._acceleration = options.acceleration || Vector2d.zero;

        this._aVelocity = options.aVelocity || 0;        // Angular velocity.
        this._aAcceleration = options.aAcceleration || 0;    // Angular acceleration.

        this.mass = options.mass || 1;
    }
    render(){
        super.render();
    }
    update(){
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);

        this.aVelocity += this.aAcceleration;
        this.angle += this.aVelocity; 
        this.aAcceleration = 0;
        
        super.update();
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

