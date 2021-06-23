import { AreaState } from "./AreaState";
import { UnitVector } from "./UnitVector";
import { Util } from "./Util";

export class EnemyNpc {
    xPos?: number;
    yPos?: number;
    dim: number = 3;
    uVecDir?: UnitVector;
    velocity: number = 2;
    areaState?: AreaState;

    util: Util = new Util();

    constructor(initialX: number, initialY: number, initialDir: UnitVector, areaState: AreaState) {
        this.xPos = initialX
        this.yPos = initialY;
        this.uVecDir = initialDir;
        this.areaState = areaState;
    }

    move(): void {
        this.xPos += this.uVecDir.getX()*this.velocity;
        this.yPos += this.uVecDir.getY()*this.velocity;

        if (this.checkObjectHit()) {
            this.uVecDir.updateDir(180+Math.random()*10);
        }
    }

    checkObjectHit(): boolean {

        let tempUVec: UnitVector = new UnitVector(this.uVecDir.getDirDeg());
        let projMag: number = 0.01;

        let incr: number = 5;

        //we want to check a tiny bit outside around the whole circle
        for(let i =0; i<360; i+=incr) {
            let x: number = this.xPos+tempUVec.getX()*(this.dim+projMag);
            let y: number = this.yPos+tempUVec.getY()*(this.dim+projMag);
            if (this.util.inMapBlock(x, y, this.areaState.getMap(), this.areaState.getCellWidth(), this.areaState.getCellHeight())) {
                return true;
            }
            tempUVec.updateDir(incr);
        }

        return false;
    }

    getX(): number {
        return this.xPos;
    }
    getY(): number {
        return this.yPos;
    }
    getDir(): UnitVector {
        return this.uVecDir;
    }
    getDim(): number {
        return this.dim;
    }
}