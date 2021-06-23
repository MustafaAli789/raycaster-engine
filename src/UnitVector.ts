export class UnitVector {
    x?: number; //x component
    y?: number; //y component
    dir?: number; //degree angle --> clockwise is positive

    constructor(dir: number) {
        this.dir = dir;
        this.x = Math.cos(this.toRad(dir));
        this.y = Math.sin(this.toRad(dir));
    }

    //change is in deg
    updateDir(change: number): void {
        this.dir += change;
        this.x = Math.cos(this.toRad(this.dir));
        this.y = Math.sin(this.toRad(this.dir));
    }

    //change is in deg
    setDir(newDir: number): void {
        this.dir = newDir;
        this.x = Math.cos(this.toRad(this.dir));
        this.y = Math.sin(this.toRad(this.dir));
    }

    toRad(deg: number): number {
        return deg*Math.PI/180;
    }
    
    getDirDeg():number {
        return this.dir;
    }

    getDirRad():number {
        return this.dir*Math.PI/180;
    }

    getX():number {
        return this.x;
    }

    getY():number {
        return this.y;
    }
}