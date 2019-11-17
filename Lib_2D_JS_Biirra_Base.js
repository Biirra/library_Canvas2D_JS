// Created by: Jan Willem Huising

/**
 * Sprite texture. 
 * Takes a Spritesheet or a Large image and take controll over which section to show on canvas.
 * 
 */
class Sprite {   
    constructor(options){
        this.context    = options.context;
        this.texture    = options.texture;
        this.alpha      = options.alpha         || 1;
        this.visible    = options.visible       || true;            // Object can be drawn on the canvas.

        this.sFrame     = options.sourceFrame   || Rect.zero;      // Data containing the location, height and width of the frame taken from the sprites texture.
        this.body       = options.bodyOptions   || Rect.zero;      // Data containing the location, height and width of self. Texture scales with this.

        this.rotation   = options.rotation      || 0;
    }
    update(){}
    render(){ 
        if(this.visible)
            this.draw();
    }
    draw(){ 
        this.context.globalAlpha = this.alpha;
        this.context.translate(this.body.location.x, this.body.location.y);
        this.context.rotate(this.rotation);
        
        this.context.drawImage(
            this.texture,                   //img	Source image 
            this.sFrame.location.x,         //sx	Source x	        
            this.sFrame.location.y,         //sy	Source y	        
            this.sFrame.width,              //sw	Source width	   
            this.sFrame.height,             //sh	Source height	   
            this.body.offset.x,             //dx	Destination x	 
            this.body.offset.y,             //dy	Destination y	   
            this.body.width,                //dw	Destination width	
            this.body.height                //dh	Destination height	
            );

        this.context.rotate(-this.rotation);
        this.context.translate(-this.body.location.x, -this.body.location.y);
        this.context.globalAlpha = 1;        
    }
    
    /**
     * Set a new selection on the sprite sheet whitch will be used as the texture shown on the canvas.
     * @param {Rect} rect 
     */
    set sFrame(rect){   // set the selection on the spritesheet.
        this._sFrame = rect;
    }
    /**
     * Get the selection whitch is used for the frame that is shown on the canvas.
     * @returns {Rect} A Rect() containing the selecion.
     */
    get sFrame(){
        return this._sFrame;
    }

    /**
     * Set a new location, width and height for the sprite. This is used to indicate where to draw the sprite on the canvas.
     * @param {Rect} rect A Rect() containing the data to draw on the screen.
     */
    set body(rect){
        this._body = rect;
    }
    /**
     * Get the location, width and height of the sprite.
     * @returns {Rect} A Rect() containing the data to draw on the screen.
     */
    get body(){
        return this._body;
    }
    set location(vector2d){
        this.body.location = vector2d;
    }
    get location(){
        return this.body.location;
    }
    
    /**
     * Set the rotation of the texture.
     * @param {number} radian
     */
    set rotation(radian){
        this._rotation = radian;
    }
    /**
     * Get the rotation of the texture.
     * @returns {number} 
     */
    get rotation(){
        return this._rotation;
    }

    set visible(boolean){
        this._visible = boolean;
    }
    get visible(){
        if(!this.context){
            // TODO: Fix this so it will not print forever than reactivate warnings if in developer mode.
            //console.warn("Context not found. Visibility is set to false by force.");
            //console.warn(this);
            return false;
        }
        return this._visible;
    }
    /**
     * Generates a copy of itself and returns it.
     * @returns {Sprite} copy of self
     */
    get copy(){
        let result = new Sprite({
            context:        this.context,                       // The context.
            texture:        this.texture,                       // The image. May be a Image or a string of the source.
            sourceFrame:    this.sFrame.copy,                   // The rectangle data of the selection it will take from the texture image.
            bodyOptions:    this.body.copy,                     // The rectangle that defines the body of the sprite. Contains data on where to write the sprite on the canvas.
            rotation:       this.rotation,                      // The rotation.
            alpha:          this.alpha
        });
        return result;
    }
}

/**
 * Sprite texture. 
 * creates an animation of a spritesheet. 
 */
class Animated_Sprite extends Sprite{
    _tickCount = 0;                                                 // The number updates since the current frame was first displayed
    constructor(options){
        super(options);
        this.numberOfFrames = options.numberOfFrames    || 1;       // The number of frames your spritesheet contains.
        this.numberOfRows   = options.numberOfRows      || 1;       // If your sprite contains more rows select the correct row to animate.
        this.ticksPerFrame  = options.ticksPerFrame     || 1;       // The speed it will loop trough it's frames. Will skip frames if below 1 to mimic speedup.
        this.loop           = options.loop              || false;   // The animation will loop or not.
        this.reverse        = options.reverse           || false;   // Determines if the animation will play in reverse.
        this.frameIndex     = options.frameIndex        || Vector2d.zero;
    }
    update() {
        this._tickCount += 1;
        while (this._tickCount > this.ticksPerFrame) {
            this._tickCount -= this.ticksPerFrame;

            // calculate next frame.
            if(!this.reverse)
                this.nextFrame();
            else
                this.previousFrame();
        }
        // set source location on Spritesheet.
        this.sFrame.location.x = this.sFrame.width * this.frameIndex.x;
        this.sFrame.location.y = this.sFrame.height * this.frameIndex.y;
        
    }
    previousFrame(){
        // If the current frame index is in range
        if (this.frameIndex.x > 0) {	
            // Go to the next frame
            this.frameIndex.x -= 1;
        }
        else if(this._frameIndex.y > 0){
            this.frameIndex.x = this.numberOfFrames - 1;
            this.frameIndex.y -= 1;
        }
        else if (this.loop){
            this.frameIndex.x = this.numberOfFrames - 1;
            this.frameIndex.y = this.numberOfRows - 1;
        }
    }
    nextFrame(){
        // If the current frame index is in range
        if (this.frameIndex.x < this.numberOfFrames - 1) {	
            // Go to the next frame
            this.frameIndex.x += 1;
        }	
        else if(this._frameIndex.y < this.numberOfRows - 1){
            this.frameIndex.x = 0;
            this.frameIndex.y += 1;
        }
        else if (this.loop){
            this.frameIndex.x = 0;
            this.frameIndex.y = 0;
        }
    }
    get frameIndex(){
        return this._frameIndex;
    }
    set frameIndex(vector2d){
        let result = vector2d.copy;
        if(vector2d.y > this.numberOfRows){
            result.y = this.numberOfRows;
        }
        if(vector2d.x > this.numberOfFrames){
            result.x = this.numberOfFrames;
        }
        this._frameIndex = result;
    }
    /**
     * Generates a copy of itself and returns it.
     * @returns {Animated_Sprite} copy of self
     */
    get copy(){
        let result = new Animated_Sprite({
            context:        this.context,                       // The context.
            texture:        this.texture,                       // The image. May be a Image or a string of the source.
            sourceFrame:    this.sFrame.copy,                   // The rectangle data of the selection it will take from the texture image.
            bodyOptions:    this.body.copy,                     // The rectangle that defines the body of the sprite. Contains data on where to write the sprite on the canvas.
            rotation:       this.rotation,                      // The rotation.

            numberOfFrames: this.numberOfFrames,                // The amount of frames horizontaly on the spritesheet. Left to right.
	        numberOfRows:   this.numberOfRows,                  // The amount of frames vertically on the spritesheet. Top to bottom.
	        loop:           this.loop,                          // The animation will start over if its finished.
            reverse:        this.reverse,                       // Play the animation in reverse
            ticksPerFrame:  this.ticksPerFrame                  // The speed it will loop trough it's frames. Will skip frames if below 1 to mimic speedup.
        });
        return result;
    }
}

/**
 * Sprite that uses phisycs
 */
class GameObject{
    constructor(options){
        this.sprite         = options.sprite;
        this.velocity       = options.velocity          || Vector2d.zero;
        this.acceleration   = options.acceleration      || Vector2d.zero;

        this.aVelocity      = options.aVelocity         || 0;               // Angular velocity.
        this.aAcceleration  = options.aAcceleration     || 0;               // Angular acceleration.

        this.mass           = options.mass              || 1;              
    }
    update(){
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);            // TODO: Think about either this.acceleration.mult(0) commented or (applyforce in update) ? What is and what isnt possible.

        this.aVelocity += this.aAcceleration;
        this.rotation += this.aVelocity; 
        this.aAcceleration = 0;     
        
        this.sprite.update();
    }
    render(){
        this.sprite.render();
    }

    /**
     * Add a force to self that influenses the location of this object.
     * @param {Vector2d} force The force applied to the acceleration of self.
     */
    applyForce(force){
        let f = Vector2d.div(force, this.mass);
        this.acceleration.add(f);
    }
    applySpin(number){
        this.aAcceleration += number / this.mass;
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
    set location(vector2d){
        this.sprite.location = vector2d;
    }
    get location(){
        return this.sprite.location;
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
    get copy(){
        return new GameObject({
            sprite :this.sprite.copy,
            velocity:  this.velocity.copy,
            acceleration :this.acceleration.copy,

            aVelocity  :this.aVelocity,
            aAcceleration :this.aAcceleration,

            mass  :this.mass
        });
    }
}


// TODO: Create reliable error/warning system. Currently most error's and warning's are spammed if in developer mode.