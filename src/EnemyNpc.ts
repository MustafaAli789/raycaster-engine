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
    velocity: number = 1;
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
        if (playerCell.col === enemyCell.col && playerCell.row === enemyCell.row) {
            let enemyToPlayerVector = {x: playerX-this.xPos, y: playerY-this.yPos};
            let enemyToPlayerVectorMag = Math.sqrt(enemyToPlayerVector.x**2 + enemyToPlayerVector.y**2)

            //Rounding here is VERY IMPORTANT
            //was having bugs where angle between player dir vector and acc dir to player was nearly 0 resulting in the dot prod and mag to be the same num (which makes sense cause this is the lin alg eqn and it works)
            //or atleast in theory the same number but due to some js shenanigans, the mag always had one less decimal place making it a tinyyyy bit smaller than the dot product
            //result in an overall number inside the acos being > 1 resulting in a nan angle and thus resulting in the uvec angle to become and the x and y pos to become nan making the enemy dissapear
            let dotProdRoundedToNearestThousand: number = Math.round(((this.uVecDir.getX()*enemyToPlayerVector.x+this.uVecDir.getY()*enemyToPlayerVector.y) + Number.EPSILON)*1000)/1000;
            let magProdRoundedToNearestThousand: number = Math.round((enemyToPlayerVectorMag + Number.EPSILON)*1000)/1000;
            let angle = Math.acos((dotProdRoundedToNearestThousand)/(magProdRoundedToNearestThousand))*180/Math.PI;
            this.uVecDir.updateDir(angle);
        } else {
            this.searcher.resetSearcher();
            let path: Node[] = this.searcher.calculatePath(enemyCell.row, enemyCell.col, playerCell.row, playerCell.col);
            let pathFirstCellXY = this.util.getXYFromMapBlock(path[1].position, this.areaState.getCellWidth(), this.areaState.getCellHeight());
            let enemyToPathFirstCellVector = {x: pathFirstCellXY.x-this.xPos, y: pathFirstCellXY.y-this.yPos};
            let enemyToPathFirstCellVectorMag = Math.sqrt(enemyToPathFirstCellVector.x**2 + enemyToPathFirstCellVector.y**2)

            let dotProdRoundedToNearestThousand: number = Math.round(((this.uVecDir.getX()*enemyToPathFirstCellVector.x+this.uVecDir.getY()*enemyToPathFirstCellVector.y) + Number.EPSILON)*1000)/1000;
            let magProdRoundedToNearestThousand: number = Math.round((enemyToPathFirstCellVectorMag + Number.EPSILON)*1000)/1000;
            let angle = Math.acos((dotProdRoundedToNearestThousand)/(magProdRoundedToNearestThousand))*180/Math.PI;
            this.uVecDir.updateDir(angle);
        }

        this.xPos += this.uVecDir.getX()*this.velocity;
        this.yPos += this.uVecDir.getY()*this.velocity;

        if (this.checkObjectHit()) {
            this.uVecDir.updateDir(180+Math.random()*10);
            console.log(this.uVecDir)
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
            if (x && y && this.util.inMapBlock(x, y, this.areaState.getMap(), this.areaState.getCellWidth(), this.areaState.getCellHeight())) {
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