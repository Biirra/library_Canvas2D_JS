class InputListener{
    constructor(canvas){
        this.canvas = canvas;
        this.mouse = {
            location: Vector2d.zero,
            clicked: false,
            down: false
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
        this.canvas.addEventListener('mousemove',   this.mouseLocationHadler);
        this.canvas.addEventListener("mousedown",   this.mouseDownHandler);
        this.canvas.addEventListener("mouseup",     this.mouseUpHandler);
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