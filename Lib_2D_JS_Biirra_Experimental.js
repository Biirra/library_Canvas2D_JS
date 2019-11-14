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

/**
 * A default particle to be used in a particle system.
 */
class Particle extends Animated_Sprite{
    _velocity = Vector2d.zero;
    _acceleration = Vector2d.zero;
    _ticksAlive = 1;   // amount of time the particle stay's alive. Measured in fps updates. TODO: Should be able to set this.
    constructor(options){
        super(options);
        this.acceleration = options.acceleration || Vector2d.zero;

        // TODO: Fadeout animation can probably belong to a Animator class
        this.fadeOut = options.fadeOut || false;
        this.fadeOutSpeed = options.fadeOutSpeed || 0.01;
        this.ticksAlive = options.ticksAlive || 100;

        this.type = options.type;  // Some default options that can be chosen.

        this.init();
    }
    init(){
        switch(this.type){
            case "example":
                this.velocity = new Vector2d(Math.randomFloatBetween(-4,4), Math.randomFloatBetween(-2,0)); 
                this.frameIndex = new Vector2d(Math.randomIntBetween(0, this.numberOfFrames - 1), Math.randomIntBetween(0, this.numberOfRows - 1));
                break;
            default:
                break;
        }
    }
    update() {
        super.update();
        this._ticksAlive -= 1;
        if(this.fadeOut && this.alpha > 0)
            this.alpha = this.fadeOutSpeed*this._ticksAlive;
        this._velocity.add(this._acceleration);
        this.body.location.add(this._velocity);
    }
    set velocity(value){
        this._velocity = value;
    }
    get velocity(){
        return this._velocity;
    }
    set acceleration(value){
        this._acceleration = value;
    }
    get acceleration(){
        return this._acceleration;
    }
    set ticksAlive(value){
        this._ticksAlive = value;
    }
    get ticksAlive(){
        return this._ticksAlive;
    }
    get alive() {
        if (this._ticksAlive <= 0.0) 
            return false;
        return true;
    }
    /**
     * Generates a copy of itself and returns it.
     * @returns {Particle} copy of self
     */
    get copy(){
        return new Particle({
            // Sprite specific
            context:        this.context,                       // The context.
            texture:        this.texture,                       // The image. May be a Image or a string of the source.
            sourceFrame:    this.sFrame.copy,                   // The rectangle data of the selection it will take from the texture image.
            bodyOptions:    this.body.copy,                     // The rectangle that defines the body of the sprite. Contains data on where to write the sprite on the canvas.
            rotation:       this.rotation,                      // The rotation.

            // Animated Sprite specific
            numberOfFrames: this.numberOfFrames,                // The amount of frames horizontaly on the spritesheet. Left to right.
	        numberOfRows:   this.numberOfRows,                  // The amount of frames vertically on the spritesheet. Top to bottom.
	        loop:           this.loop,                          // The animation will start over if its finished.
            reverse:        this.reverse,                       // Play the animation in reverse
            ticksPerFrame:  this.ticksPerFrame,                 // The speed it will loop trough it's frames. Will skip frames if below 1 to mimic speedup.
            
            // Particle specific
            fadeOut:        this.fadeOut,                       // Particle will fade out if its time.
            fadeOutSpeed:   this.fadeOutSpeed,                  // The speed at which the particle fades out. 
            acceleration:   this.acceleration.copy,             // Mainly contains outside forces that this is affected by.
            ticksAlive:     this.ticksAlive,                    // The amount of ticks it will stay alive for.
            type:           this.type
        });
    }
}

/**
 * A particle system that will create and show set particle.
 */
class ParticleSystem {
    particles = [];    // An array for all the particles
    _tickCount = 0;
    constructor(options) {                     
        this.location = options.location || Vector2d.zero;      // An origin point for where particles are birthed
        this.maxNoP = options.maxNumberOfParticles || 1;        // The maximum amount of pixels this system can have at the moment of existing.

        this.originParticle = options.originParticle;           // The original particle. All spawned particles will be copy's
        this.spawnSpeed = options.spawnSpeed || 1;              // Amount of ticks that need to pass before it can spawn a new particle.    
        this.batchSize = options.batchSize || 1;                // The amount of particles that spawn per update.

        this.paused = options.paused || false;                  // If true it will not create any new particles.

        this.init();
    }
    init(){
        //this.addOriginParticleByBatch(this.batchSize);
    }
    update() {
        this._tickCount += 1;
        // Cycle through the ArrayList backwards b/c we are deleting
        for (let i = this.particles.length-1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update();
            if (!particle.alive) {
                this.particles.splice(i,1);
            }
        }
        
        // if allowed and its time to create a new particle.
        if(this._tickCount >= this.spawnSpeed && !this.paused){
            this._tickCount = 0;
            // if there is room for new particles add new particles
            this.addOriginParticleByBatch(this.batchSize);
        }
    }
    renderChildren(){
        // cylcle backwards so the new particles are displayed behind older particles.
        for (let i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].render();
        }
    }
    addOriginParticleByBatch(batchSize){
        if(this.maxNoP+batchSize > this.particles.length){
            for(let i = 0; i < batchSize; i++){
                this.addOriginParticle();
            }
        }
    }
    addOriginParticle(){
        let p = this.originParticle.copy;
        p.body.location = this.location.copy;
        this.particles.push(p);
    }
    addParticleByBatch(particle, batchSize){
        if(this.maxNoP+batchSize > this.particles.length){
            for(let i = 0; i < batchSize; i++){
                this.addParticle(particle);
            }
        }
    }
    addParticle(particle){
        let p = particle.copy;
        p.body.location = this.location.copy;
        this.particles.push(p);
    }
    get alive(){
        if (this.particles.length === 0) 
            return false;
        return true;
    }
} 