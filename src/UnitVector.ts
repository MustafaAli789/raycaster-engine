export class UnitVector {
    x?: number;
    y?: number;
    dir?: number; //degree angle --> clockwise is pos

    constructor(dir: number) {
        this.dir = dir;
        this.x = Math.cos(this.toRad(dir));
        this.y = Math.sin(this.toRad(dir));
    }

    updateDir(change: number): void {
        this.dir += change;
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