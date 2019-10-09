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
    Shortcut function to het a new Vector2d with the coordinates of x:0, y:0
    */
    static zero(){
        return new Vector2d(0,0);
    };
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
A basic sprite. Contains a width a hight property's to be visible on the canvas.
http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
*/

class Sprite{
    constructor(options){
        this.context = options.context; // the canvas this sprite is going to be drawn upon.

        this.width = options.width || 0;
        this.height = options.height || 0;
        this.location = options.location || Vector2d.zero();

        this.img = options.img;
        
        this.frameIndex = options.frameIndex || 1;      //The current frame to be displayed
        this.numberOfFrames = 10;                        //The number of frames your spritesheet contains.
        this.frames = [];                               //holds the bitmapped frames

        this.tickCount = 0;                             //The number updates since the current frame was first displayed
        this.ticksPerFrame = 0;                         //The number updates until the next frame should be displayed

        this.visible = true;

        console.log(this);
    }
    update() {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            // If the current frame index is in range
            if (this.frameIndex < this.numberOfFrames - 1) {	
                // Go to the next frame
                this.frameIndex += 1;
            }	
        }
    };
    loadImg(src){
        this.img = new Image(); // change this to global since we dont want to keep looking for the image. 
        this.img.src = src;
    }
    toggleVisible(){
        this.visible = !this.visible;
    }
    getColor(){
        return this.color;
    }
    getIMG(){
        return this.img;
    }
    getFrames(){
        if(this.frames.length > 0)
            return this.frames;

        this.frames = [];
        for(let i = 0; i < this.numberOfFrames; i++){
            this.frames[i] = createImageBitmap(
                        this.img, 
                        i * this.width, 
                        0, 
                        this.width, 
                        this.height);
        }
        
        return this.frames;
    }
    draw(sprites){
        // Draw each sprite onto the canvas
        this.context.drawImage(sprites[this.frameIndex], 0, 0);
    }
    render(){
        // Wait for the sprite sheet to load
        let self = this;
        this.img.onload = function(e) {
            Promise.all(
                self.getFrames()
            ).then(function(sprites) {
                self.draw(sprites);
            });
        }
    }
}

class Entity extends Sprite{
    constructor(location, velocity, acceleration){
        super();
        this.setLocation(location);
        this.setVelocity(velocity);
        this.setAcceleration(acceleration);
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
}
