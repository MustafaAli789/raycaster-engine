import { UnitVector } from "./UnitVector";
import { Util } from './Util'
import { AreaState } from "./AreaState";

enum ObjectHit {
    Player,
    Wall,
    Ray,
    None
}

export class Bullet {
    xPos?: number;
    yPos?: number;
    uVecDir?: UnitVector;
    velocity: number = 3;
    dim: number = 3; //i.e square side length
    crouchedBullet: boolean = false; //if bullet was created while player crouched (needed for rendering height of bullet in 3d)

    areaState?: AreaState;

    util: Util = new Util();
    
    constructor(startX: number, startY: number, uVecDir: UnitVector, crouchedBullet: boolean, areaState: AreaState){
        this.xPos = startX; //center bullet around player
        this.yPos = startY; //center bullet around player
        this.uVecDir = uVecDir;
        this.areaState = areaState;
        this.crouchedBullet = crouchedBullet;
    }

    moveBullet(): void {
        this.xPos += this.velocity*this.uVecDir.getX();
        this.yPos += this.velocity*this.uVecDir.getY();
    }

    checkObjectHit(): ObjectHit {

        let tempUVec: UnitVector = new UnitVector(this.uVecDir.getDirDeg());
        let projMag: number = 0.01;

        let incr: number = 5;

        //we want to check a tiny bit outside around the whole circle
        for(let i =0; i<360; i+=incr) {
            let x: number = this.xPos+tempUVec.getX()*(this.dim+projMag);
            let y: number = this.yPos+tempUVec.getY()*(this.dim+projMag);
            if (this.util.inMapBlock(x, y, this.areaState.getMap(), this.areaState.getCellWidth(), this.areaState.getCellHeight())) {
                return ObjectHit.Wall;
            }
            tempUVec.updateDir(incr);
        }

        return ObjectHit.None;
    }

    draw2D(): void {
        // expand out from each side a bit to see if in block
        let ctx = this.areaState.getCanvas2D().getContext('2d');

        ctx.fillStyle = 'grey';

        ctx.moveTo(this.xPos, this.yPos);
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.dim, 0, 2*Math.PI);
        ctx.fill();
    }

    getX(): number{
        return this.xPos;
    }

    getY(): number {
        return this.yPos;
    }

    getCrouchedBullet(): boolean {
        return this.crouchedBullet;
    }

    getDim(): number {
        return this.dim;
    }


}