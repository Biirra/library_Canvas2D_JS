class InputListener{
    constructor(){
        this.mouse = {
            location: Vector2d.zero,
            clicked: false,
            down: false,
            moving: false
        }
        this.init();
    }
    init(){
        this.setupHandlers();
        this.enable();
    }
    setupHandlers(){
        this.mouseLocationHadler  = this.updateMouseLocation.bind(this);
        this.mouseDownHandler = this.updateMouseDown.bind(this);
        this.mouseUpHandler = this.updateMouseUp.bind(this);

		return this;
    }
    enable(){
        document.addEventListener('mousemove',   this.mouseLocationHadler);
        document.addEventListener("mousedown",   this.mouseDownHandler);
        document.addEventListener("mouseup",     this.mouseUpHandler);
		return this;
    }
    // Do Mouse Stuff
    updateMouseUp(){
        this.mouse.down         = false;
        this.mouse.clicked      = false;
    }
    updateMouseDown(){
        this.mouse.clicked      = !this.mouse.down;
        this.mouse.down         = true;
    }
    updateMouseLocation(){
        let x = event.offsetX;
        let y = event.offsetY;

        this.mouse.location     = new Vector2d(x,y);
        this.mouse.clicked      = (event.which == 1 && !this.mouse.down);
        this.mouse.down         = (event.which == 1);
    }
}

// registers if object is hovered upon or clicked. Use for objects that do something on mouse input (e.i. Button)
// TODO: Documentation
class Button {
    constructor(options) {
        this.clicked    = false;
        this.hovered    = false;
        this.entered    = false;    // checks if the ui object is entered the object. Should run once.
        this.released   = true;

        // possible states of the button.
        this.sprite_default     = options.sprite_default;
        this.sprite_onHover     = options.sprite_onHover;
        this.sprite_onClick     = options.sprite_onClick;

        this.backgroundSprite   = options.sprite_default;   // the sprite that is currently rendered.

        // the value of the button.
        this.sprite             = options.sprite;
        this.text               = options.text;

        this.location           = options.location;
        
        this.init();
    }
    init(){

        this.sprite_default.location = this.location.copy;
        this.sprite_onHover.location = this.location.copy;
        this.sprite_onClick.location = this.location.copy;

        if (this.sprite){
            let showmodel = this.sprite;
            
            let x = this.location.x + (this.backgroundSprite.body.width/2)  - (showmodel.body.width  / 2);
            let y = this.location.y + (this.backgroundSprite.body.height/2) - (showmodel.body.height / 2);
            showmodel.location       = new Vector2d(x,y);
            showmodel.body.anchor    = this.backgroundSprite.body.anchor;
        }
    }
    update(input) {
        let wasNotClicked = !this.clicked;  // reminder so it wont keep clicking if mouse button is hold.
        let wasNotReleased = !this.released;

        if (this.intersects(this.backgroundSprite.body, input.mouse)) {
            // mouse has entered the object.
            if(!this.hovered){
                this.sprite.location.y += 5;                    // TODO: this could probably be set automaticly.
                if(this.sprite_onHover)
                    this.backgroundSprite = this.sprite_onHover;
                if(this.onEnter)
                    this.onEnter();
            }
            this.hovered = true;
            // check if user has clicked while mouse is on opject.
            if (input.mouse.clicked) {
                this.clicked = true;
                this.released = false;
            }
        } else {
            // mouse has left the object.
            if(this.hovered){
                this.sprite.location.y -= 5;                    // TODO: this could probably be set automaticly.
                if(this.sprite_default)
                    this.backgroundSprite = this.sprite_default;
                if(this.onLeave)
                    this.onLeave();
            }
            this.hovered = false;
        }
        // user is no longer clicking.
        if (!input.mouse.down) {
            this.clicked = false;
            this.released = true;
            if(wasNotReleased){
                if(!this.hovered && this.sprite_default)
                    this.backgroundSprite = this.sprite_default;
                else if(this.sprite_onHover)
                    this.backgroundSprite = this.sprite_onHover; 
                
                if(this.onReleased)
                    this.onReleased();
            }
        }

        // do stuff if user clicks or holds the object.
        if (this.clicked ) {
            if(wasNotClicked){
                if(this.sprite_onClick)
                    this.backgroundSprite = this.sprite_onClick;
                if(this.onClick)
                    this.onClick();
            }
            if(this.onPressed)
                this.onPressed();
        }
        // do stuff if user hovers on object.
        if(this.hovered && this.onHover){
            this.onHover();
        }

        if(this.sprite)
            this.sprite.update();
    }
    intersects(obj, mouse) {
        let xIntersect = mouse.location.x  > obj.location.x && mouse.location.x  < obj.location.x + obj.width;
        let yIntersect = mouse.location.y  > obj.location.y && mouse.location.y  < obj.location.y + obj.height;
        return  xIntersect && yIntersect;
    }
    /*
    onClick(){
        
    }
    onReleased(){
        // Runs once when the object is no longer clicked.
    }
    onPressed(){
        // Will execute while the user is holding the right mouse button clicked on the object.
    }
    onHover(){
    }
    onEnter(){
    }
    onLeave(){
    }
    */
    render(ctx) {
        this.backgroundSprite.render(ctx);
        if(this.sprite){
            let obj = this.sprite.copy;
            obj.render(ctx);
        }
        if(this.text){
            //text options
            let fontSize = 50;
            let fontColor = new Color(1,1,1,1);
            ctx.fillStyle = fontColor.colorString + ";";
            ctx.font = fontSize + "px Arial";
        
            //text position
            let textSize = ctx.measureText(this.text);
            let textX = this.sprite.location.x + (this.sprite.body.width/2) - (textSize.width / 2);
            let textY = this.sprite.location.y + (this.sprite.body.height/2) - (fontSize/2);
    
            //console.log(`text x: ${textX}, y: ${textY}`);

            //draw the text
            ctx.fillText(this.text, textX, textY);
        }
    }
    set location(vector2d){
        this.backgroundSprite.location = vector2d;
    }
    get location(){
        return this.backgroundSprite.location;
    }
}