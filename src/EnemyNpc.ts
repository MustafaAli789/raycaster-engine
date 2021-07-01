import { AreaState } from "./AreaState";
import { AStarSearch } from "./AStarSearch";
import { UnitVector } from "./UnitVector";
import { Util } from "./Util";

interface Position {
    row: number,
    col: number
}

interface Node {
    id: string,
    position: Position,
    g_score: number,
    h_score: number,
    f_score: number,
    parent_Node?: Node
}

export class EnemyNpc {
    xPos?: number;
    yPos?: number;
    dim: number = 5;
    uVecDir?: UnitVector;
    velocity: number = 2;
    areaState?: AreaState;
    searcher?: AStarSearch;

    util: Util = new Util();

    constructor(initialX: number, initialY: number, initialDir: UnitVector, areaState: AreaState) {
        this.xPos = initialX
        this.yPos = initialY;
        this.uVecDir = initialDir;
        this.areaState = areaState;

        this.searcher = new AStarSearch(areaState);
    }

    move(playerX: number, playerY: number): void {

        let playerCell: Position = this.util.getMapBlockFromCoord(playerX, playerY, this.areaState.getCellWidth(), this.areaState.getCellHeight());
        let enemyCell: Position = this.util.getMapBlockFromCoord(this.xPos, this.yPos, this.areaState.getCellWidth(), this.areaState.getCellHeight());
        this.searcher.resetSearcher();
        let path: Node[] = this.searcher.calculatePath(enemyCell.row, enemyCell.col, playerCell.row, playerCell.col);

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

    draw2D(): void {
        let ctx = this.areaState.getCanvas2D().getContext('2d');

        ctx.fillStyle = 'red';

        ctx.moveTo(this.xPos, this.yPos);
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.dim, 0, 2*Math.PI);
        ctx.fill();
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