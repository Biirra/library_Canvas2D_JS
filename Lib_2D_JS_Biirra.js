/*
Color(r,g,b,o)
r : red value
g : green value
b : blue value
o : opacity value
*/
class Color{
    constructor(r,g,b,o=1){
        this.red = r;
        this.green = g;
        this.blue = b;
        this.opacity = o;
    }
    // Returns a rgba string that can be used for css.
    getColorString(){
        return "rgba("+this.red+","+this.green+","+this.blue+","+this.opacity+")";
    }
    // set the color with a hex value.
    // hex value is not saved. use getColorHex to read out value.
    setColorHex(hex){
        let rgb = Color.hexToRgb(hex);
        this.red = rgb.r;
        this.green = rgb.g;
        this.blue = rgb.b;
    }
    // return the current color in hex. Opacity is lost.
    getColorHex(){
        return Color.rgbToHex(this.red, this.green, this.blue);
    }
    /*
    returns the hex string of the rgb value given.
    r:red value
    g:green value
    b:blue value
    */
    static rgbToHex(r, g, b) {
        return "#" + Color.componentToHex(r) + Color.componentToHex(g) + Color.componentToHex(b);
    }
    static componentToHex(c) {
        let hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }
    // returns rgb object.
    static hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    // returns a Color object with a hex and alpha value
    static hexToRgba(hex, alpha){
        let result = this.hexToRgb(hex);
        return new Color(result.r, result.g, result.b, alpha);
    }
}

// TODO: Docomentation
/*
An object that keeps track of data that has coordinates in 2d.
For example the location, velocity, acceleration of a sprite.
*/
class Vector2d{
    constructor(x, y){
        this.setX(x);
        this.setY(y);
    }
    setX(x){
        this.x = parseFloat(x);
    }
    setY(y){
        this.y = parseFloat(y);
    }
    getX(){
        return this.x;
    }
    getY(){
        return this.y;
    }
    set(vector2d){
        this.setX(vector2d.getX());
        this.setY(vector2d.getY());
    }
    add(vector2d) {
        this.x += vector2d.x;
        this.y += vector2d.y;
    };
    sub(vector2d) {
        this.x -= vector2d.x;
        this.y -= vector2d.y;
    };
    mult(mult) {
        this.x *= mult;
        this.y *= mult;
    };
    div(div) {
        this.x /= div;
        this.y /= div;
    };
    mag() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };
    norm() {
        let m = this.mag();
        if (m !== 0) {
            this.div(m);
        }
    };
    limit(max) {
        if (this.mag() > max) {
            this.norm();
            this.mult(max);
        }
    };
    static add(v1, v2){
        return new Vector2d(v1.getX() + v2.getX(), v1.getY() + v2.getY());
    }
    static sub(v1, v2){
        return new Vector2d(v1.getX() - v2.getX(), v1.getY() - v2.getY());
    }
    static mult(v1, mult){
        return new Vector2d(v1.getX() * mult, v1.getY() * mult);
    }
    static div(v1, div){
        return new Vector2d(v1.getX() / div, v1.getY() / div);
    }
    /*
    Shortcut functions to create a new Vector2d
    */
    static zero(){
        return new Vector2d(0,0);
    }
    static up(){
        return new Vector2d(0,1);
    }
    static down(){
        return new Vector2d(0,-1);
    }
    static right(){
        return new Vector2d(1,0);
    }
    static left(){
        return new Vector2d(-1,0);
    }
    /*
    Returns a Vector2d with random coordinates from 0 to 1.
    Use a multiplier to increase this.
    */
    static random(multiplier){
        // return a random Vector2d
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
}

/*
A sprite. Contains a width a hight property's to be visible on the canvas.

with inspiration from:
http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
*/

class Sprite{
    _frameIndex = 0;                                    // The current frame to be displayed
    _tickCount = 0;                                     // The number updates since the current frame was first displayed
    
    visible = true;                                     // Sprite can be drawn. will still update the animation.

    constructor(options){
        this.context = options.context;                         // The canvas this sprite is going to be drawn upon.

        this.location = options.location || Vector2d.zero();    // The location on the canvas where the sprite will be drawn. 

        this.width = options.width || 0;                        // Height of sprite on the spritesheet in pixels.
        this.height = options.height || 0;                      // Width of sprite on the spritesheet in pixels.

        this.img = options.img;                                 // The spritesheet that belongs to this sprite.
        this.imgRow = options.imgRow || 0;            // If your spritesheet contains more rows select the correct row to animate.
        
        this.numberOfFrames = options.numberOfFrames || 1;      // The number of frames your spritesheet contains.
        this.ticksPerFrame = options.animationSpeed || 1;       // The number updates until the next frame should be displayed. Speed is calculeted by window.requestAnimationFrame / this.ticksPerFrame (i.e.: 60fps/4 = 16fps)
        this.loop = options.loop || false;                      // The animation will loop or not.

    }
    setLocation(x,y){
        this.location = new Vector2d(x,y);
    }
    update() {
        this._tickCount += 1;
        if (this._tickCount > this.ticksPerFrame) {
            this._tickCount = 0;
            // If the current frame index is in range
            if (this._frameIndex < this.numberOfFrames - 1) {	
                // Go to the next frame
                this._frameIndex += 1;
            }	
            else if (this.loop) {
                this._frameIndex = 0;
            }
        }
    }
    setImg(src){
        this.img = new Image(); 
        this.img.src = src;
    }
    toggleVisible(){
        this.visible = !this.visible;
    }
    render(){
        if(!this.visible)
            return;
        // Clear the canvas        

        this.context.beginPath();
        this.context.drawImage(
            this.img,                           //img	Source image object	Sprite sheet
            this._frameIndex*this.width,         //sx	Source x	Frame index times frame width
            this.imgRow*this.height,                                  //sy	Source y	0
            this.width,                         //sw	Source width	Frame width
            this.height,                        //sh	Source height	Frame height
            this.location.x,                    //dx	Destination x	0
            this.location.y,                    //dy	Destination y	0
            this.width,                         //dw	Destination width	Frame width
            this.height                         //dh	Destination height	Frame height
            );
        this.context.closePath();

    }
}

class Entity extends Sprite{
    alive = true;   // false to mark for deletion.
    constructor(options){
        super(options);
        this.velocity = options.velocity || Vector2d.zero();
        this.acceleration = options.acceleration || Vector2d.zero();
    }
    isWithinRange(point, range){
        return this.location.x - range < point.x &&
            this.location.x + range > point.x &&
            this.location.y - range < point.y &&
            this.location.y + range > point.y;
    }
    setAcceleration(vector2d){
        this.acceleration = vector2d;
    }
    getAcceleration(){
        return this.acceleration;
    }
    setVelocity(vector2d){
        this.velocity = vector2d;
    }
    getVelocity(){
        return this.velocity;
    }
    setLocation(vector2d){
        this.location = vector2d;
    }
    getLocation(){
        return this.location;
    }
    kill(){
        this.alive = false;
    }
}
