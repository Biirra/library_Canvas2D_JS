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
