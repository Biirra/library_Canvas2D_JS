// Created by: Jan Willem Huising

/**
 * A default particle to be used in a particle system.
 */
class Particle extends GameObject{
    constructor(options){
        super(options);
        this.fadeOut        = options.fadeOut       || false;   // particle will fadeOut when dieing
        this.fadeOutSpeed   = options.fadeOutSpeed  || 0.01;    // the speed the partcle will fade out with. If fadeout it true.
        this.ticksAlive     = options.ticksAlive    || 100;     // amount of time the particle stay's alive. Measured in fps updates. 
        this.type           = options.type;                     // Some default options that can be chosen.

        this.init();
    }
    init(){
        switch(this.type){
            case "Default":
                this.velocity           = new Vector2d(Math.randomFloatBetween(-4,4), Math.randomFloatBetween(-4,4));                 
                this.sprite.frameIndex  = new Vector2d(Math.randomIntBetween(0, this.sprite.numberOfFrames - 1), Math.randomIntBetween(0, this.sprite.numberOfRows - 1));
                break;
            default:
                break;
        }
    }
    update() {
        this._ticksAlive -= 1;
        if(this.fadeOut && this.sprite.alpha > 0)
            this.sprite.alpha = this.fadeOutSpeed*this.ticksAlive;            

        super.update();
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
        let result = new Particle({
            sprite: this.sprite.copy,
            mass: this.mass,
            fadeOut: this.fadeOut,                              // Particle will fade out if its time to die.
            fadeOutSpeed: this.fadeOutSpeed,                    // The speed at which the particle fades out. 
            ticksAlive: this.ticksAlive,                        // The time in ticks it stays alive before dissapearing. 

            type: this.type                                     // Use a pre-programmed behavior
        });
        return result;

    }
}

/**
 * A particle system that will create and show set particle.
 */
class ParticleSystem {
    particles = [];     // An array for all the particles
    _tickCount = 0;
    constructor(options) {                     
        this.location       = options.location          || Vector2d.zero;       // An origin point for where particles are birthed
        this.maxNoP         = options.maxNoP            || 1;                   // The maximum amount of pixels this system can have at the moment of existing.

        this.originParticle = options.originParticle;                           // The original particle. All spawned particles will be copy's
        this.spawnSpeed     = options.spawnSpeed        || 1;                   // Amount of ticks that need to pass before it can spawn a new particle.    
        this.batchSize      = options.batchSize         || 1;                   // The amount of particles that spawn per update.

        this.paused         = options.paused            || false;               // If true it will not create any new particles.
    }
    update() {
        this._tickCount += 1;
        // Cycle through the ArrayList backwards b/c we are deleting
        for (let i = this.particles.length-1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update();
            if (!particle.alive) {
                this.particles.splice(i,1); // TODO: See if this can be speed up. Is currently the most time consuming thing.
            }
        }
        
        // if allowed and its time, create a new particle.
        if(this._tickCount >= this.spawnSpeed && !this.paused){
            this._tickCount = 0;
            this.addOriginParticleByBatch(this.batchSize);
        }
    }
    render(){
        // cylcle backwards so the new particles are displayed behind older particles.
        for (let i = this.particles.length-1; i >= 0; i--) {
            this.particles[i].render();
        }
    }
    addOriginParticleByBatch(batchSize){
        // if there is room for new particles add new particles
        if(this.maxNoP+batchSize > this.particles.length){
            for(let i = 0; i < batchSize; i++){
                this.addOriginParticle();
            }
        }
    }
    addOriginParticle(){
        let p = this.originParticle.copy;
        p.location = this.location.copy;
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
        p.location = this.location.copy;
        this.particles.push(p);
    }
    get alive(){
        if (this.particles.length === 0) 
            return false;
        return true;
    }
} 