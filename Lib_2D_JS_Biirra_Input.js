class InputListener{
    constructor(canvas){
        this.canvas = canvas;
        this._mousePosition = Vector2d.zero;
        this._mouseState = {
            clicked:false,
            pressed:false,
            released:false,
            drag:false
        }
        this._keyState = {};
        this.init();
    }
    init(){
        this.setupHandlers();
        this.enable();
    }
    setupHandlers(){
        this.updateMousePositionHadler  = this.updateMousePosition.bind(this);
        this.updateKeyDownHandler = this.updateKeyDown.bind(this);
        this.updateKeyUpHandler = this.updateKeyUp.bind(this);
		return this;
    }
    enable(){
        this.canvas.addEventListener('mousemove', this.updateMousePositionHadler);
        document.addEventListener('keypress', this.updateKeyDownHandler);
        document.addEventListener('keyup', this.updateKeyUpHandler);
		return this;
    }
    updateKeyDown(event){
        this._keyState[event.code] = event;
        this._keyState[event.code].isDown = true;
    }
    updateKeyUp(event){
        this._keyState[event.code] = event;
        this._keyState[event.code].isDown = false;        
    }
    updateMousePosition(){
        let x = event.clientX || this._mousePosition.x;
        let y = event.clientY || this._mousePosition.y;
        this._mousePosition =  new Vector2d(x,y);
    }
    get mousePos(){
        return this._mousePosition;
    }
}