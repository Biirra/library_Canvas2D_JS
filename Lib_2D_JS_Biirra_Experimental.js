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

class Ball extends Entity{
    constructor(options){
        super(options);
        this.impactScale = new Vector2d(0.75,0.75);
        this.blounceSpeed = 0.01;
    }
    bounce(){
        let maxSizeX = this.original.scale.x + this.impactScale.x;
        let maxSizeY = this.original.scale.y + this.impactScale.y;
        let minSizeX = this.original.scale.x - this.impactScale.x;
        let minSizeY = this.original.scale.y - this.impactScale.y;

        // go bigger if
        //  its not above max
        //  its not going smaller.
        let max = this.scale.x > maxSizeX && this.scale.y > maxSizeY;
        let min = this.scale.x < minSizeX && this.scale.y < minSizeY;
        if(max){
            this._animatingEnlarge = false;
            this.scale.x = maxSizeX;
            this.scale.y = maxSizeY;
        }
        else if(!max && !this._animatingDiminish){
            this.scale.x += this.blounceSpeed;
            this.scale.y += this.blounceSpeed;
            if(!this._animatingEnlarge){
                this._animatingEnlarge = true;
                this._animatingDiminish = false;
            }
        }

        // go smaller if
        //  its not below min
        //  its not going bigger.
        if (min){
            this._animatingDiminish = false;
            this.scale.x = minSizeX;
            this.scale.y = minSizeY;
            //this._jumping = false;
        }
        else if(!min && !this._animatingEnlarge){
            this.scale.x -= this.blounceSpeed;
            this.scale.y -= this.blounceSpeed;
            if(!this._animatingDiminish){
                this._animatingDiminish = true;
                this._animatingEnlarge = false;
            }
        }
    }
}


/*
Seem to be making use alot of this context so creating a class for it.
Class consists of a location, height and width.
*/
class Rect{
    _location = Vector2d.zero;
    _width = 0;
    _height = 0;
    constructor(width = 0, height = 0, location = Vector2d.zero){
        this.location = location;
        this.height = height;
        this.width = width;
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
}

/**
 * Sprite texture. 
 * Takes a Spritesheet or a Large image and take controll over which section to show on canvas.
 */
class Sprite {
    // TODO: Use Rect instead
    _sFrame = Rect.zero;                    // Data containing the location, height and width of the frame taken from the sprites texture.
    _body = Rect.zero;                      // Data containing the location, height and width of self. Texture scales with this.

    _offset = Vector2d.zero;                // TODO: say what it does

    _visible = true;                        // Object can be drawn on the canvas.
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
    render(){ 
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
            this._sFrame.location.x,    //sx	Source x	        
            this._sFrame.location.y,    //sy	Source y	        
            this._sFrame.width,         //sw	Source width	   
            this._sFrame.height,        //sh	Source height	   
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

        // Calculate offset
        // increase width by scale and apply the anchor
        let width = this.width * this.scale.x;
        let widthOffset = width  * this.anchor.x;
        // increase height by scale and apply the anchor
        let height = this.height * this.scale.y;
        let heightOffset = height * this.anchor.y;
        
        // set offset
        this._offset = new Vector2d(widthOffset, heightOffset);

        // apply custom offset.
        this._offset.add(vector2d);
    }
    /**
     * texture
     * @param {Image||string} image set the texture with either an Image object or a (String)src of the image. Img object reccomended
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
        this._sFrame.location.x = vector2d.x;
        this._sFrame.location.y = vector2d.y;
    }
    get sLocation(){
        return this._sFrame.location;
    }
    /**
     * Source height.
     * @param {number} number
     */
    set sHeight(number){
        this._sFrame.height = number;
    }
    get sHeight(){
        return this._sFrame.height;
    }
    /**
     * Source width.
     * @param {number} number
     */
    set sWidth(number){
        this._sFrame.width = number;
    }
    get sWidth(){
        return this._sFrame.width;
    }

    /**
     * Destination location.
     * @param {Vector2d} vector2d
     */
    set location(vector2d){
        this._body.location = vector2d.copy;
    }
    get location(){
        return this._body.location;
    }
    /**
     * Destination height.
     * @param {number} number
     */
    set height(number){
        this._body.height = number*this.scale.y;
    }
    get height(){
        return this._body.height;
    }
    /**
     * Destination width.
     * @param {number} number
     */
    set width(number){
        this._body.width = number*this.scale.x;
    }
    get width(){
        return this._body.width;
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