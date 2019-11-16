 // Created by: Jan Willem Huising
 
 /**
  * Returns a float between a min and max.
  * @param {number} a Min value.
  * @param {number} b Max value.
  * @returns {number} Random float between a and b
  */
Math.randomFloatBetween = function (a, b) {
    return Math.random() * (b - a ) + a;
};
/**
  * Returns a int between a min and max.
  * @param {number} a Min value.
  * @param {number} b Max value.
  * @returns {number} Random int between a and b
  */
Math.randomIntBetween = function(a, b) { 
    return Math.floor(Math.random() * (b - a ) + a);
};

/*
Color(r,g,b,a)
r : red value
g : green value
b : blue value
a : opacity value / alpha channel
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
        this.x = x;
        this.y = y;
    }
    /**
     * Add the values of a Vector2d to the current parameters.
     * @param {Vector2d} vector2d Value to overwrite object parameters with.
     */
    add(vector2d) {
        this.x += vector2d.x;
        this.y += vector2d.y;
    }
    /**
     * Subtract the values of a Vector2d from the current parameters.
     * @param {Vector2d} vector2d Value to overwrite object parameters with.
     */
    sub(vector2d) {
        this.x -= vector2d.x;
        this.y -= vector2d.y;
    }
    /**
     * Multiply the current parameters with a multiplier.
     * @param {number} mult Value to multiply object parameters with.
     */
    mult(mult) {
        this.x *= mult;
        this.y *= mult;
    }
    /**
     * Divide the current parameters with a divider.
     * @param {number} div Value to divide object parameters with.
     */
    div(div) {
        this.x /= div;
        this.y /= div;
    }
    /**
     * Return the magnitude of the object.
     * @returns {number} Contains the magnitude of this object.
     */
    mag() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
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
        return new Vector2d(0,-1);
    }
    static get down(){
        return new Vector2d(0,1);
    }
    static get right(){
        return new Vector2d(1,0);
    }
    static get left(){
        return new Vector2d(-1,0);
    }
    /**
     * Returns a Vector2d with random coordinates.
     * @param   {number}    minX        minimal value for x coordinate
     * @param   {number}    maxX        maximal value for x coordinate
     * @param   {number}    minY        minimal value for y coordinate
     * @param   {number}    maxY        maximal value for y coordinate
     * @returns {Vector2d}              Contains a new Vector with random parameters.
     */
    static random(minX, maxX, minY, maxY){
        let result;
        let decider = Math.random();

        let x = Math.randomFloatBetween(minX, maxX);
        let y = Math.randomFloatBetween(minY, maxY);
        
        if (decider <= 0.25) {
            result = new Vector2d(-x, -y);
        } else if (decider > 0.25 && decider <= 0.5) {
            result = new Vector2d(-x, y);
        } else if (decider > 0.5 && decider <= 0.75) {
            result = new Vector2d(x, -y);
        } else {
            result = new Vector2d(x, y);
        }
        
        return result;
    }
    /**
     * Set the x parameter of the object.
     * @param {number} x Value will be parsed to float before set.
     */
    set x(x){
        this._x = x;
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
        this._y = y;
    }
    /**
     * Get the y parameter of the object.  
     * @returns {number} Returns the value of this._y.
     */ 
    get y(){
        return this._y;
    }
    /**
     * Get a copy of this object. 
     * @returns {Vector2d} Returns a copy of this.
     */ 
    get copy(){
        return new Vector2d(this.x, this.y);
    }
}

/*
Seem to be making use alot of this context so creating a class for it.
Class consists of a location, height and width.
TODO: Create documentation.
*/
class Rect{
    constructor(options){
        this.location   = options.location  || Vector2d.zero;
        this.height     = options.height    || 0;
        this.width      = options.width     || 0;
        this.scale      = options.scale     || Vector2d.one;
        this.anchor     = options.anchor    || Vector2d.zero;
        this.offset     = Vector2d.zero;

        this.init();
    }
    init(){
        this.applyScale();
        this.applyOffset();
    }
    applyScale(){
        this.width  *= this.scale.x;
        this.height *= this.scale.y;
    }
    applyOffset(){
        this.offset = Vector2d.zero;
        this.offset.x = this.width  * this.anchor.x;
        this.offset.y = this.height * this.anchor.y;
        this.offset.mult(-1);
    }
    set scale(vector2d){
        this._scale = vector2d;
    }
    get scale(){
        return this._scale;
    }
    set anchor(vector2d){
        this._anchor = vector2d;
    }
    get anchor(){
        return this._anchor;
    }
    set location(vector2d){
        this._location = vector2d;
    }
    get location(){
        return this._location;
    }
    set height(number){
        this._height = number;
    }
    get height(){
        return this._height;
    }
    set width(number){
        this._width = number;
    }
    get width(){
        return this._width;
    }
    static get zero(){
        return new Rect();
    }
    get copy(){
        return new Rect({
            location: this.location.copy,
            width: this.width, 
            height: this.height,
            scale: this.scale.copy,
            anchor: this.anchor.copy            
        });
    }
}

