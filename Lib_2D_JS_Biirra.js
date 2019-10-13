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
A sprite is used to display a img or animation on the canvas. 

with inspiration from:
http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/

TODO:   Add way of scaling the image.
*/
class Sprite{
    _frameIndex = 0;                                            // The current frame to be displayed
    _frameRow =  0;                                             // The current row to be displayed
    _tickCount = 0;                                             // The number updates since the current frame was first displayed
    
    constructor(options){
        this.context = options.context;                         // The canvas this sprite is going to be drawn upon.

        this._location = options.location || Vector2d.zero;     // The location on the canvas where the sprite will be drawn. 
        this._angle = options.angle || 0;

        this.width = options.width || 0;                        // Height of sprite on the spritesheet in pixels.
        this.height = options.height || 0;                      // Width of sprite on the spritesheet in pixels.

        this._img = options.img;                                // The spritesheet that belongs to this sprite.
        this._visible = this._img !== undefined                 // Sprite can be drawn. TODO: include somekind of warning or handle diffrently;
        
                         
        this.numberOfFrames = options.numberOfFrames    || 1;   // The number of frames your spritesheet contains.
        this.numberOfRows   = options.numberOfRows      || 1;   // If your sprite contains more rows select the correct row to animate.
        this.ticksPerFrame  = options.ticksPerFrame    || 1;   // The number updates until the next frame should be displayed. Speed is calculeted by window.requestAnimationFrame / this.ticksPerFrame (i.e.: 60fps/4 = 16fps)
        this.loop = options.loop || false;                      // The animation will loop or not.
        this.reverse = options.reverse || false;                // Determines if the animation will play in reverse.
    }
    update() {
        this._tickCount += 1;
        if (this._tickCount > this.ticksPerFrame) {
            this._tickCount = 0;
            if(!this.reverse)
                this.nextFrame();
            else
                this.previousFrame();
        }
    }
    previousFrame(){
        // If the current frame index is in range
        if (this._frameIndex > 0) {	
            // Go to the next frame
            this._frameIndex -= 1;
        }
        else if(this._frameRow > 0){
            this._frameIndex = this.numberOfFrames-1;
            this._frameRow -= 1;
        }
        else if (this.loop){
            this._frameIndex = this.numberOfFrames-1;
            this._frameRow = this.numberOfRows-1;
        }
    }
    nextFrame(){
        // If the current frame index is in range
        if (this._frameIndex < this.numberOfFrames - 1) {	
            // Go to the next frame
            this._frameIndex += 1;
        }	
        else if(this._frameRow < this.numberOfRows -1){
            this._frameIndex = 0;
            this._frameRow += 1;
        }
        else if (this.loop){
            this._frameIndex = 0;
            this._frameRow = 0;
        }
    }
    // draw's itself to the canvas.
    render(){
        if(!this.visible)
            return;      
        
        this.draw();
    }
    draw(){
        if(this.context === undefined){
            console.error("Context is not found.");
            console.error(this);
            this._visible = false;
            return;
        }

        let offsetCenterX = this.width / 2;
        let offsetCenterY = this.height / 2;
        this.context.translate(this.location.x+offsetCenterX, this.location.y+offsetCenterY);
        this.context.rotate(this.angle);
        this.context.drawImage(
            this._img,                          //img	Source image        object	Sprite sheet
            this._frameIndex*this.width,        //sx	Source x	        Frame index times frame width
            this._frameRow*this.height,         //sy	Source y	        Frame row times frame height
            this.width,                         //sw	Source width	    Frame width
            this.height,                        //sh	Source height	    Frame height
            -offsetCenterX,                     //dx	Destination x	    0 - this.width / 2
            -offsetCenterY,                     //dy	Destination y	    0 - this.height / 2
            this.width,                         //dw	Destination width	Frame width
            this.height                         //dh	Destination height	Frame height
            );
        this.context.rotate(-this.angle);
        this.context.translate(-(this.location.x+offsetCenterX), -(this.location.y+offsetCenterY));
    }
    set angle(angle){
        this._angle = angle;
    }
    get angle(){
        return this._angle;
    }
    /**
     * Set the location where the object will be drawn on the canvas.
     * @param {Vector2d} vector2d
     */
    set location(vector2d){
        this._location = vector2d;
    }
    /**
     * Get the location of the object. Returns a Vector2d
     * @returns {Vector2d} Returns the current location of this object.
     */
    get location(){
        return this._location;
    }
    /**
     * Set a new image sprite sheet.
     * @param {string} src The source string of where the image is location in your folder.
     */
    set img(src){
        this._img = new Image(); 
        this._img.src = src;
    }
    /**
     * Get the current image spritesheet. Returns a html img element.
     * @returns {Image} Returns the image element of this object.
     */
    get img(){
        return this._img;
    }
    /**
     * Set the visibility of the object.
     * @param {boolean} visible
     */
    set visible(visible){
        this._visible = visible;
    }
    /**
     * Get the visibility of the object.
     * @returns {boolean}
     */
    get visible(){
        return this._visible;
    }
    // Toggle the visibility of the object. If false the object will update but will not be drawn to canvas.
    toggleVisible(){
        this._visible = !this._visible;
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
    /**
     * Detect if self is touching the targets.
     * @param  {Sprite} target     The sprite object it comes into contact with.
     * @param  {Vector2d} [offset=Vector2d.zero]
     * @return {boolean}
     * 
     * TODO:    Test if things work correctly if self.velocity is zero and target is hitting self.
     *          Change this so it will use a collision box.
     */
    onCollisionEnter(target, offset=Vector2d.zero){
        return this.location.x < target.location.x + target.width + offset.x   // check collision with the right side of target
            && this.location.x + this.width + offset.x > target.location.x     // check collision with the left side of target
            && this.location.y < target.location.y + target.height + offset.y  // check collision with the bottom side of target
            && this.location.y + this.height + offset.y > target.location.y;   // check collision with the top side of target
    }
    /**
     * Check if self is not touching the target. Note that target needs to have a bigger width and height than self to work propperly.
     * @param   {Sprite} target 
     * @param   {Vector2d} [offset=Vector2d.zero] 
     * @returns {boolean}
     */
    onCollisionLeave(target, offset=Vector2d.zero){
        return !this.onCollisionEnter(target, offset);
    }
    update(){
        super.update();
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);

        this.angle = Math.atan2(this.velocity.y,this.velocity.x);
    }
    /**
     * Add a force to the object that influenses the location of this object.
     * @param {Vector2d} force The force applied to the acceleration of the object.
     */
    applyForce(force){
        let f = Vector2d.div(force, this.mass);
        this.acceleration.add(force);
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
