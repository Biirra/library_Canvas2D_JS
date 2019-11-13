/**
 * Cause this is not a default method for some reason. 
 */
Math.randomFloatBetween = function (a, b) {
    return Math.random() * (b - a + 1) + a;
};
Math.randomIntBetween = function(a, b) { 
    return Math.floor(Math.random() * (b - a + 1) + a);
};

/*
Color(r,g,b,o)
r : red value
g : green value
b : blue value
o : opacity value / alpha channel
*/
class Color{
    constructor(r,g,b,a=1){
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }
    /**
     * Returns a rgba string that can be used for css or fillstyle on canvas.
     * @returns {string} Returns the rgba value of the object in string format.
     */
    get colorString(){
        return "rgba("+this.red+","+this.green+","+this.blue+","+this.alpha+")";
    }
    /**
     * Set the color with a hex value.
     * @param {string} hex Value of a color in hex format.
     */
    set colorHex(hex){
        let rgb = Color.hexToRgb(hex);
        this.red = rgb.r;
        this.green = rgb.g;
        this.blue = rgb.b;
    }
    /**
     * Return the current color in hex. Opacity is lost.
     * @returns {string} Returns a string containing the hex value of this object. 
     */
    get colorHex(){
        return Color.rgbToHex(this.red, this.green, this.blue);
    }
    /**
     * Returns the hex string of the rgb value given.
     * @param {number} r Red value.
     * @param {number} g Green value.
     * @param {number} b Blue value.
     */
    static rgbToHex(r, g, b) {
        return "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b);
    }
    /**
     * Converts a number to hexadecimal.
     * @param   {number} c      Value to convert to hexadecimal.
     * @returns {string}        Returns a string containing the hexadecimal.
     */
    static componentToHex(c) {
        let hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    /**
     * Returns rgb object.
     * @param  {string} hex     Value of a color in hex format.
     * @return {object}         Return an object with the following properties.
     * @return {number}         Return r red value.
     * @return {number}         Return g green value.
     * @return {number}         Return b blue value.
     */
    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    /**
     * Returns a Color object with a hex and alpha value.
     * @param   {string} hex        Contains the string that will be transformed to rgb values.
     * @param   {number} alpha      Contains the alpha value to set the opacity of the object.
     * @returns {Color}             Returns a new Color object with given parameters. 
     */
    static hexToRgba(hex, alpha){
        let result = this.hexToRgb(hex);
        return new Color(result.r, result.g, result.b, alpha);
    }
}

/*
An object that keeps track of data that has coordinates in 2d.
For example the location, velocity, acceleration of a sprite.
*/
class Vector2d{
    constructor(x, y){
        this._x = x;
        this._y = y;
    }
    /**
     * Overwrite the current parameters with a Vector2d.
     * @param {Vector2d} vector2d Value to overwrite object parameters with.
     */
    set(vector2d){
        this.setX(vector2d.getX());
        this.setY(vector2d.getY());
    }
    /**
     * Add the values of a Vector2d to the current parameters.
     * @param {Vector2d} vector2d Value to overwrite object parameters with.
     */
    add(vector2d) {
        this._x += vector2d.x;
        this._y += vector2d.y;
    }
    /**
     * Subtract the values of a Vector2d from the current parameters.
     * @param {Vector2d} vector2d Value to overwrite object parameters with.
     */
    sub(vector2d) {
        this._x -= vector2d.x;
        this._y -= vector2d.y;
    }
    /**
     * Multiply the current parameters with a multiplier.
     * @param {number} mult Value to multiply object parameters with.
     */
    mult(mult) {
        this._x *= mult;
        this._y *= mult;
    }
    /**
     * Divide the current parameters with a divider.
     * @param {number} div Value to divide object parameters with.
     */
    div(div) {
        this._x /= div;
        this._y /= div;
    }
    /**
     * Return the magnitude of the object.
     * @returns {number} Contains the magnitude of this object.
     */
    mag() {
        return Math.sqrt((this._x * this._x) + (this._y * this._y));
    };
    // Normalize the parameters of this object.
    norm() {
        let m = this.mag();
        if (m !== 0) {
            this.div(m);
        }
    }
    /**
     * If the current parameters have values above the max this function will overwrite the parameters of this object to the maximal value it can have. 
     * @param {number} max Maximal value this object can have. 
     */
    limit(max) {
        if (this.mag() > max) {
            this.norm();
            this.mult(max);
        }
    }
    /**
     * Add two Vector2d's together.
     * @param   {Vector2d} v1 
     * @param   {Vector2d} v2 
     * @returns {Vector2d}      Contains a new Vector2d with combined values.
     */
    static add(v1, v2){
        return new Vector2d(v1.getX() + v2.getX(), v1.getY() + v2.getY());
    }
    /**
     * Subtract two Vector2d's from eachother.
     * @param   {Vector2d} v1 
     * @param   {Vector2d} v2 
     * @returns {Vector2d}      Contains a new Vector2d with combined values.
     */
    static sub(v1, v2){
        return new Vector2d(v1.getX() - v2.getX(), v1.getY() - v2.getY());
    }
    /**
     * Multiply a given Vector2d with a value.
     * @param   {Vector2d}  v1 
     * @param   {number}    mult 
     * @returns {Vector2d}          Contains a new Vector2d with Multiplied values.
     */
    static mult(v1, mult){
        return new Vector2d(v1.getX() * mult, v1.getY() * mult);
    }
    /**
     * Divide a given Vector2d with a value.
     * @param   {Vector2d}  v1 
     * @param   {number}    div 
     * @returns {Vector2d}          Contains a new Vector2d with divided values.
     */
    static div(v1, div){
        return new Vector2d(v1.x / div, v1.y / div);
    }
    /*
    Shortcut functions to create a new Vector2d
    */
    static get zero(){
        return new Vector2d(0,0);
    }
    static get one(){
        return new Vector2d(1,1);
    }
    static get up(){
        return new Vector2d(0,1);
    }
    static get down(){
        return new Vector2d(0,-1);
    }
    static get right(){
        return new Vector2d(1,0);
    }
    static get left(){
        return new Vector2d(-1,0);
    }
    /**
     * Returns a Vector2d with random coordinates from 0 to 1.
     * Use a multiplier to increase this.
     * @param   {number}    multiplier  
     * @returns {Vector2d}              Contains a new Vector with random parameters.
     * TODO: Make sure it takes y coordinates in consideration aswell.
     */
    static random(multiplier){
        let vector;
        let random = Math.random();
        if (random <= 0.25) {
            vector = new Vector2d(-Math.random() * multiplier, -Math.random() * multiplier);
        } else if (random > 0.25 && random <= 0.5) {
            vector = new Vector2d(-Math.random() * multiplier, Math.random() * multiplier);
        } else if (random > 0.5 && random <= 0.75) {
            vector = new Vector2d(Math.random() * multiplier, -Math.random() * multiplier);
        } else {
            vector = new Vector2d(Math.random() * multiplier, Math.random() * multiplier);
        }
        return vector;
    }
    /**
     * Untested. Prepared for usage of translating an angle and distance to a x,y coordinate.
     * @param {*} length 
     * @param {*} angleDegree 
     */
    static polarToCartasian(length, angleDegree){
        let x = length * cos(angleDegree);
        let y = length * sin(angleDegree);
        return new Vector2d(x,y);
    }
    /**
     * Set the x parameter of the object.
     * @param {number} x Value will be parsed to float before set.
     */
    set x(x){
        this._x = parseFloat(x);
    }
    /**
     * Get the x parameter of the object.  
     * @returns {number} Returns the value of this._x.
     */ 
    get x(){
        return this._x;
    }
    /**
     * Set the y parameter of the object.
     * @param {number} y Value will be parsed to float before set.
     */
    set y(y){
        this._y = parseFloat(y);
    }
    /**
     * Get the y parameter of the object.  
     * @returns {number} Returns the value of this._y.
     */ 
    get y(){
        return this._y;
    }
    static randomFloat(min, max) {
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        return (Math.random() * (max - min) + min) * plusOrMinus; //The maximum is inclusive and the minimum is inclusive 
    }
    get copy(){
        return new Vector2d(this.x, this.y);
    }
}

/**
 * Sprite texture. 
 * Takes a Spritesheet or a Large image and take controll over which section to show on canvas.
 */
class Sprite {
    _sLocation = Vector2d.zero;             // Source x & Source y
    _sWidth = 0;                            // Source width
    _sHeight = 0;                           // Source height

    _location = Vector2d.zero;             // Destination x & Destination y
    _width = 0;                            // Destination width
    _height = 0;                           // Destination height
    _offset = Vector2d.zero;

    _visible = true;
    constructor(options){
        this.context    = options.context;
        this._texture   = options.texture;
        this.alpha = options.alpha || 1;

        this.sLocation  = options.sLocation     || Vector2d.zero;
        this.sWidth     = options.sWidth        || 0;
        this.sHeight    = options.sHeight       || 0;

        this.location   = options.location      || Vector2d.zero;
        this.anchor     = options.anchor        || Vector2d.zero;
        this.scale      = options.scale         || Vector2d.one;
        this.offset     = options.offset        || Vector2d.zero;
        this.width      = options.width         || this.sWidth;
        this.height     = options.height        || this.sHeight;
        
        this.rotation   = options.rotation      || 0;
    }
    render(){   // TODO: It looks like this is called multiple times in performance tab when more than 1 object exists. Check this and find out why this happens.
        this.location.sub(this.offset);
        if(this.visible)
            this.draw();
    }
    draw(){ 
        this.context.globalAlpha = this.alpha;
        this.context.translate(this.location.x, this.location.y);
        this.context.rotate(this.rotation);
        this.context.drawImage(
            this.texture,               //img	Source image 
            this.sLocation.x,           //sx	Source x	        
            this.sLocation.y,           //sy	Source y	        
            this.sWidth,                //sw	Source width	   
            this.sHeight,               //sh	Source height	   
            0,                          //dx	Destination x	 
            0,                          //dy	Destination y	   
            this.width,                 //dw	Destination width	
            this.height                 //dh	Destination height	
            );
        this.context.rotate(-this.rotation);
        this.context.translate(-this.location.x, -this.location.y);
        this.context.globalAlpha = 1;
    }
    /**
     * Readonly the offset from the original 0,0 position.
     */
    get offset(){
        return this._offset;
    }
    set offset(vector2d){ // TODO: It works but be sure of what this is supposed to do and check if it works as expected. 
        this._offset.x = ((this._width * this._scale.x) * this._anchor.x) + vector2d.x;
        this._offset.y = ((this._height * this._scale.y) * this._anchor.y) + vector2d.y;
    }
    /**
     * texture
     * @param {Image||string} image
     */
    set texture(image){
        if(typeof image === string){
            let result = new Image();
            result.src = image;
            this._texture = result;
            if(this.developerMode){
                Console.warn("New Image created for this.texture. If same source is used repeatedly, consider defining it first as a new Image(src) and use that instead.");
                Console.warn(this);
            }
            return;
        }
        if(typeof image === Image){
            this._texture = image;
            return;
        }
            
    }
    get texture(){
        return this._texture;
    }
    /**
     * Source location.
     * @param {Vector2d} vector2d
     */
    set sLocation(vector2d){
        this._sLocation.x = vector2d.x;
        this._sLocation.y = vector2d.y;
    }
    get sLocation(){
        return this._sLocation;
    }
    /**
     * Source height.
     * @param {number} number
     */
    set sHeight(number){
        this._sHeight = number;
    }
    get sHeight(){
        return this._sHeight;
    }
    /**
     * Source width.
     * @param {number} number
     */
    set sWidth(number){
        this._sWidth = number;
    }
    get sWidth(){
        return this._sWidth;
    }

    /**
     * Destination location.
     * @param {Vector2d} vector2d
     */
    set location(vector2d){
        this._location.x = vector2d.x;
        this._location.y = vector2d.y;
    }
    get location(){
        return this._location;
    }
    /**
     * Destination height.
     * @param {number} number
     */
    set height(number){
        this._height = number*this.scale.y;
    }
    get height(){
        return this._height;
    }
    /**
     * Destination width.
     * @param {number} number
     */
    set width(number){
        this._width = number*this.scale.x;
    }
    get width(){
        return this._width;
    }
    set anchor(vector2d){
        this._anchor = vector2d;
    }
    get anchor(){
        return this._anchor;
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
    set scale(vector2d){
        this._scale = vector2d;
    }
    get scale(){
        return this._scale;
    }
    set visible(boolean){
        this._vivible = boolean;
    }
    get visible(){
        if(!this.context){
            //console.warn("Context not found. Visibility is set to false by force.");
            //console.warn(this);
            return false;
        }
        return this._visible;
    }
    get copy(){
        let result = new Sprite({
            context:        this.context,                       // The context.
            texture:        this.texture,                       // The image. May be a Image or a string of the source.
            sLocation:      this.sLocation.copy,                // Top right location of the selected area on the image.
            sWidth:         this.sWidth,                        // The height of the selected area on the image.
            sHeight:        this.sHeight,                       // The Widht of the selected area on the image.
            location:       this.location.copy,                 // The location where to draw the selected area on the canvas.
            anchor:         this.anchor.copy,                   // The center of the selected area. Vector.one = bottom right corner.
            width:          this.width,                         // The width that scales the selected area.
            height:         this.height,                        // The height that scales the selected area.
            scale:          this.scale.copy,                    // The scale of the selected area.
            rotation:       this.rotation,                      // The rotation.
        });
        return result;
    }
}

/**
 * Sprite texture. 
 * creates an animation of a spritesheet. 
 */
class Animated_Sprite extends Sprite{
    _frameIndex = Vector2d.zero;                                // The current frame to be displayed
    _tickCount = 0;                                             // The number updates since the current frame was first displayed

    constructor(options){
        super(options);
        this.numberOfFrames = options.numberOfFrames    || 1;       // The number of frames your spritesheet contains.
        this.numberOfRows   = options.numberOfRows      || 1;       // If your sprite contains more rows select the correct row to animate.
        this.ticksPerFrame  = options.ticksPerFrame     || 1;       // The speed it will loop trough it's frames. Will skip frames if below 1 to mimic speedup.
        this.loop           = options.loop              || false;   // The animation will loop or not.
        this.reverse        = options.reverse           || false;   // Determines if the animation will play in reverse.
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
        this.sLocation.x = this._sWidth * this.frameIndex.x;
        this.sLocation.y = this._sHeight * this.frameIndex.y;
    }
    previousFrame(){
        // If the current frame index is in range
        if (this.frameIndex.x > 0) {	
            // Go to the next frame
            this.frameIndex.x -= 1;
        }
        else if(this._frameIndex.y > 0){
            this.frameIndex.x = this.numberOfFrames-1;
            this.frameIndex.y -= 1;
        }
        else if (this.loop){
            this.frameIndex.x = this.numberOfFrames-1;
            this.frameIndex.y = this.numberOfRows-1;
        }
    }
    nextFrame(){
        // If the current frame index is in range
        if (this.frameIndex.x < this.numberOfFrames - 1) {	
            // Go to the next frame
            this.frameIndex.x += 1;
        }	
        else if(this._frameIndex.y < this.numberOfRows -1){
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
        if(vector2d.y > this.numberOfRows){
            console.warn(`Frameindex.y is bigger than the total amount of rows that has been set. Changing frameindex.y to ${this.numberOfRows}`);
            vector2d.y = this.numberOfRows;
        }
        if(vector2d.x > this.numberOfFrames){
            console.warn(`Frameindex.x is bigger than the total amount of frames that has been set. Changing frameindex.x to ${this.numberOfFrames}`);
            vector2d.y = this.numberOfFrames;
        }
        this._frameIndex = vector2d;
    }
    get copy(){
        let result = new Animated_Sprite({
            context:        this.context,                       // The context.
            texture:        this.texture,                       // The image. May be a Image or a string of the source.
            sLocation:      this.sLocation.copy,                // Top right location of the selected area on the image.
            sWidth:         this.sWidth,                        // The height of the selected area on the image.
            sHeight:        this.sHeight,                       // The Widht of the selected area on the image.
            location:       this.location.copy,                 // The location where to draw the selected area on the canvas.
            anchor:         this.anchor.copy,                   // The center of the selected area. Vector.one = bottom right corner.
            width:          this.width,                         // The width that scales the selected area.
            height:         this.height,                        // The height that scales the selected area.
            scale:          this.scale.copy,                    // The scale of the selected area.
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
class Entity extends Animated_Sprite{
    _original;
    constructor(options){
        super(options);
        this._velocity      = options.velocity      || Vector2d.zero;
        this._acceleration  = options.acceleration  || Vector2d.zero;

        this._aVelocity     = options.aVelocity     || 0;        // Angular velocity.
        this._aAcceleration = options.aAcceleration || 0;       // Angular acceleration.

        this.mass           = options.mass          || 1;

        this.init();
    }
    init(){
        this.original = this.copy;
    }
    update(){
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);

        this.aVelocity += this.aAcceleration;
        this.rotation += this.aVelocity; 
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
    get original(){
        return this._original;
    }
    set original(value){
        this._original = value;
    }
}


/**
 * A default particle to be used in a particle system.
 */
class Particle extends Animated_Sprite{
    _velocity = Vector2d.zero;
    _acceleration = Vector2d.zero;
    _ticksAlive = 1;   // amount of time the particle stay's alive. Measured in fps updates. TODO: Should be able to set this.
    constructor(options){
        super(options);
        this.acceleration = options.acceleration || Vector2d.zero;
        this.fadeOut = options.fadeOut || false;
        this.fadeOutSpeed = options.fadeOutSpeed || 0.01;
        this.ticksAlive = options.ticksAlive || 100;

        this.type = options.type;  // Some default options that can be chosen.

        this.init();
    }
    init(){
        switch(this.type){
            case "example":
                this.velocity = new Vector2d(Math.randomFloatBetween(-1,1), Math.randomFloatBetween(-2,0)); 
                this.frameIndex = new Vector2d(Math.randomIntBetween(0, this.numberOfFrames), Math.randomIntBetween(0, this.numberOfRows));
                break;
            default:
                break;
        }
        
    }
    update() {
        super.update();
        this._ticksAlive -= 1;
        if(this.fadeOut && this.alpha > 0)
            this.alpha = this.fadeOutSpeed*this._ticksAlive;
        this._velocity.add(this._acceleration);
        this._location.add(this._velocity);
    }
    set velocity(value){
        this._velocity = value;
    }
    get velocity(){
        return this._velocity;
    }
    set acceleration(value){
        this._acceleration = value;
    }
    get acceleration(){
        return this._acceleration;
    }
    set ticksAlive(value){
        this._ticksAlive = value;
    }
    get ticksAlive(){
        return this._ticksAlive;
    }
    get alive() {
        if (this._ticksAlive <= 0.0) 
            return false;
        return true;
    }
    get copy(){
        return new Particle({
            // Sprite specific
            context:        this.context,                       // The context.
            texture:        this.texture,                       // The image. May be a Image or a string of the source.
            sLocation:      this.sLocation.copy,                // Top right location of the selected area on the image.
            sWidth:         this.sWidth,                        // The height of the selected area on the image.
            sHeight:        this.sHeight,                       // The Widht of the selected area on the image.
            location:       this.location.copy,                 // The location where to draw the selected area on the canvas.
            anchor:         this.anchor.copy,                   // The center of the selected area. Vector.one = bottom right corner.
            width:          this.width,                         // The width that scales the selected area.
            height:         this.height,                        // The height that scales the selected area.
            scale:          this.scale.copy,                    // The scale of the selected area.
            rotation:       this.rotation,                      // The rotation.

            // Animated Sprite specific
            numberOfFrames: this.numberOfFrames,                // The amount of frames horizontaly on the spritesheet. Left to right.
	        numberOfRows:   this.numberOfRows,                  // The amount of frames vertically on the spritesheet. Top to bottom.
	        loop:           this.loop,                          // The animation will start over if its finished.
            reverse:        this.reverse,                       // Play the animation in reverse
            ticksPerFrame:  this.ticksPerFrame,                 // The speed it will loop trough it's frames. Will skip frames if below 1 to mimic speedup.
            
            // Particle specific
            fadeOut:        this.fadeOut,                       // Particle will fade out if its time.
            fadeOutSpeed:   this.fadeOutSpeed,                  // The speed at which the particle fades out. 
            acceleration:   this.acceleration.copy,             // Mainly contains outside forces that this is affected by.
            ticksAlive:     this.ticksAlive,                    // The amount of ticks it will stay alive for.
            type:           this.type
        });
    }
}

/**
 * A particle system that will create and show set particle.
 */
class ParticleSystem {
    particles = [];    // An array for all the particles
    _tickCount = 0;
    constructor(options) {                     
        this.location = options.location || Vector2d.zero;      // An origin point for where particles are birthed
        this.maxNoP = options.maxNumberOfParticles || 1;        // The maximum amount of pixels this system can have at the moment of existing.

        this.originParticle = options.originParticle;           // The original particle. All spawned particles will be copy's
        this.spawnSpeed = options.spawnSpeed || 1;              // Amount of ticks that need to pass before it can spawn a new particle.    
        this.batchSize = options.batchSize || 1;                // The amount of particles that spawn per update.

        this.paused = options.paused || false;                  // If true it will not create any new particles.

        this.init();
    }
    init(){
        this.addOriginParticleByBatch(this.batchSize);
    }
    update() {
        this._tickCount += 1;
        // Cycle through the ArrayList backwards b/c we are deleting
        for (let i = this.particles.length-1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update();
            if (!particle.alive) {
                this.particles.splice(i,1);
            }
        }
        
        // if allowed and its time to create a new particle.
        if(this._tickCount >= this.spawnSpeed && !this.paused){
            this._tickCount = 0;
            // if there is room for new particles add new particles
            this.addOriginParticleByBatch(this.batchSize);
        }
    }
    renderChildren(){
        // cylcle backwards so the new particles are displayed behind older particles.
        for (let i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].render();
        }
    }
    addOriginParticleByBatch(batchSize){
        if(this.maxNoP+batchSize > this.particles.length){
            for(let i = 0; i < batchSize; i++){
                this.addOriginParticle();
            }
        }
    }
    addOriginParticle(){
        let p = this.originParticle.copy;
        p.location = this.location.copy;
        this.particles.push(p);
    }
    addParticleByBatch(particle, batchSize){
        if(this.maxNoP+batchSize > this.particles.length){
            for(let i = 0; i < batchSize; i++){
                this.addParticle(particle);
            }
        }
    }
    addParticle(particle){
        let p = particle.copy;
        p.location = this.location.copy;
        this.particles.push(p);
    }
    get alive(){
        if (this.particles.length === 0) 
            return false;
        return true;
    }
} 



// TODO: Create reliable error/warning system. Currently all error's and warning's are spammed if in developer mode.