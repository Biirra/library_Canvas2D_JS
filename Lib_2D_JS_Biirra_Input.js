class InputListener{
    constructor(canvas){
        this.canvas = canvas;
        this._mousePosition = Vector2d.zero;

        this.init();
    }
    init(){
        this.setupHandlers();
        this.enable();
    }
    setupHandlers(){
        this.updateMousePositionHadler  = this.updateMousePosition.bind(this);
		return this;
    }
    enable(){
        this.canvas.addEventListener('mousemove', this.updateMousePositionHadler);
		return this;
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