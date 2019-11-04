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


// CHECK OUT http://processingjs.org/learning/topic/simpleparticlesystem/
// Good start for creating particles. 
class particle{
    _location = Vector2d.zero;
    _velocity = Vector2d.zero;
    _acceleration = Vector2d.zero;
    _timer = 100;
    _radius = 0;
    _alive = true;
    _color = new Color(0 ,0, 0, 1);
    constructor(origin){
        this.location = origin.copy;
    }
    update() {
        this._timer -= 1;
        this._velocity.add(this._acceleration);
        this._location.add(this._velocity);
    }
    // Method to display
    render() {
        // draw particle.
    }
    set location(value){
        this._location = value;
    }
    get location(){
        return this._location;
    }
    set timer(value){
        this._timer = value;
    }
    get timer(){
        return this._timer;
    }
    get alive() {
        if (this._timer <= 0.0) 
            return true;
        return false;
    }
}
class ParticleSystem {
    constructor( num,  vector2d) {
        this.particles = new ArrayList();              // An arraylist for all the particles
        this.origin = vector2d.copy();                 // An origin point for where particles are birthed
        this.init(num);
    }
    init(num){
        for (let i = 0; i < num; i++) {
            this.addParticle();
        }
    }
    update() {
        // Cycle through the ArrayList backwards b/c we are deleting
        for (let i = this.particles.length-1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update();
            if (!particle.alive) {
                this.particles.splice(i,1);
            }
        }
    }
    addParticle() {
        this.particles.push(new Particle(this.origin));
    }
    addParticle(p) {
        this.particles.push(p);
    }
    get alive(){
        if (this.particles.length === 0) 
            return true;
        return false;
    }
} 