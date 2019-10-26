

/*
Some predifined forces to be used.
*/
class Forces{
    constructor(){}
    //winds
    static get breeze(){
        return new Vector2d();
    }
    static get wind(){
        return new Vector2d(0.01,0);
    }
    static get windy(){
        return new Vector2d();
    }
    static get storm(){
        return new Vector2d();
    }
    static get friction(){
        return new Vector2d();
    }
    static get resistanceWater(){
        return new Vector2d();
    }
    static get resistanceAir(){
        return new Vector2d();
    }
    static get gravity(){
        return new Vector2d(0,0.1);
    }
}



