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
        this.canvas.addEventListener('mousemove', this.updateMousePosition);
		return this;
    }
    updateMousePosition(){
        let x = event.clientX || 0;
        let y = event.clientY || 0;
        this._mousePosition =  new Vector2d(x,y);
    }
    get mousePos(){
        return this._mousePosition;
    }
}