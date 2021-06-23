import { UnitVector } from "./UnitVector";

export class EnemyNpc {
    xPos?: number;
    yPos?: number;
    dim: number = 3;
    uVecDir?: UnitVector;
    velocity: number = 0;

    constructor(initialX: number, initialY: number, initialDir: UnitVector) {
        this.xPos = initialX
        this.yPos = initialY;
        this.uVecDir = initialDir;
    }

    move(): void {
        this.xPos += this.uVecDir.getX()*this.velocity;
        this.yPos += this.uVecDir.getY()*this.velocity;
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