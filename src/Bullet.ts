import { BlockType } from "./BlockType";
import { Map } from "./Map";
import { MapSizeInfo } from "./MapSizeInfo.interface";
import { UnitVector } from "./UnitVector";

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
    velocity: number = 0.5;
    canvas2D?: HTMLCanvasElement;
    dim: number = 30; //i.e square side length
    mapSizeInfo?: MapSizeInfo;
    

    constructor(startX: number, startY: number, uVecDir: UnitVector, canvas2D: HTMLCanvasElement, mapSizeInfo: MapSizeInfo){
        this.xPos = startX;
        this.yPos = startY;
        this.uVecDir = uVecDir;
        this.canvas2D = canvas2D;
        this.mapSizeInfo = mapSizeInfo;
    }

    moveBullet(): void {
        this.xPos += this.velocity*this.uVecDir.getX();
        this.yPos += this.velocity*this.uVecDir.getY();
    }

    getCurBlock(curX: number, curY: number): {x: number, y: number} {
        let curXBlockIndex: number = Math.ceil(curX/this.mapSizeInfo.cellWidth)-1;
        let curYBlockIndex: number = Math.ceil(curY/this.mapSizeInfo.cellHeight)-1;
        return {x: curXBlockIndex, y: curYBlockIndex};
    }

    pointAfterRotation(unRotatedX: number, unRotatedY: number, clockWiseRotation: number): {x: number, y: number} {
        let newX: number = unRotatedX*Math.cos(-clockWiseRotation)-unRotatedY*Math.sin(-clockWiseRotation);
        let newY: number = unRotatedX*Math.sin(-clockWiseRotation)+unRotatedY*Math.cos(-clockWiseRotation);
        return {x: newX, y: newY};
    }

    //the pont of this method is to project x even spaced vecs out of a side of the bullet (which is a square) and determine if any of those are in a player, ray, or wall
    checkIfBulletSideInObject(side: string, map: Map): ObjectHit {

        //this vec is in the dir of the side of the bullet we care about
        let uVec: UnitVector = new UnitVector(this.uVecDir.getDirDeg());

        //this vec is perpendicular to above one and will be used to move up the side of the bullet as we project out
        let pUVec: UnitVector = new UnitVector(uVec.getDirDeg()+90);;

        //corner of bullet (forward is top left, left is bottom left, right is top right, bottom is bottom right) --> initial case is top left
        //MUST TAKE INTO ACCOUNT ROTATION OF BULLET
        //***using special formula for point after rotation: https://math.stackexchange.com/questions/270194/how-to-find-the-vertices-angle-after-rotation --> jus first formula
        let startPoint: {x: number, y: number} = this.pointAfterRotation(this.xPos, this.yPos, uVec.getDirRad());

        //FORWARD dir is same dir as unit vec for dir bullet is pointing
        if (side === 'LEFT') {
            uVec.updateDir(-90);
            startPoint = this.pointAfterRotation(this.xPos, this.yPos+this.dim, uVec.getDirRad());
            pUVec = new UnitVector(uVec.getDirDeg()+90);
        } else if (side === 'RIGHT') {
            uVec.updateDir(90);
            startPoint = this.pointAfterRotation(this.xPos+this.dim, this.yPos, uVec.getDirRad());
            pUVec = new UnitVector(uVec.getDirDeg()+90);
        } else if (side === 'BOTTOM') {
            uVec.updateDir(180);
            startPoint = this.pointAfterRotation(this.xPos+this.dim, this.yPos+this.dim, uVec.getDirRad());
            pUVec = new UnitVector(uVec.getDirDeg()+90);
        }

        let numProjections: number = 50;
        let space: number = this.dim/numProjections;

        //really how far out from sied of sqaure we want to go
        let projMag: number = 0.01;

        let projX: number = startPoint.x + uVec.getX()*projMag;
        let projY: number = startPoint.y + uVec.getY()*projMag;

        for(let i =0; i<numProjections; i++) {
            if (map.getBlocks()[this.getCurBlock(projX, projY).y][this.getCurBlock(projX, projY).x].getBlockType() === BlockType.Wall) {
                return ObjectHit.Wall;
            } else {
                projX += pUVec.getX()*space;
                projY += pUVec.getY()*space;
            }
        }

        return ObjectHit.None;
    }

    //look into checking with dir of unit vector
    //can then rotate unit vec 90 deg to elft and right and 180 deg to opp side to check all 4 sides
    //this will take into account the actual rotation of the thing
    //better to do  hit points on each side instead of one at the middle
    checkObjectHit(map: Map): ObjectHit {

        if(this.checkIfBulletSideInObject('FORWARD', map) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if(this.checkIfBulletSideInObject('LEFT', map) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if(this.checkIfBulletSideInObject('RIGHT', map) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if(this.checkIfBulletSideInObject('BOTTOM', map) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }

        return ObjectHit.None;
        // this.checkIfBulletSideInObject('LEFT', map);
        // this.checkIfBulletSideInObject('RIGHT', map);
        // this.checkIfBulletSideInObject('BOTTOM', map);


        // let midX: number = this.xPos+this.dim/2;
        // let midY: number = this.yPos+this.dim/2;

        // //checking left side
        // let curX: number = midX - this.dim/2 - 0.01;
        // let curY: number = midY;

        // if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
        //     return true;
        // }

        // //right side
        // curX = midX + this.dim/2 + 0.01;
        // curY = midY;

        // if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
        //     return true;
        // }

        // //top side
        // curX = midX;
        // curY = midY - this.dim/2 - 0.01;

        // if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
        //     return true;
        // }

        // //bottom side
        // curX = midX;
        // curY = midY + this.dim/2 + 0.01;

        // if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
        //     return true;
        // }

        // return false;
    }

    draw2D(): void {
        // expand out from each side a bit to see if in block
        let ctx = this.canvas2D.getContext('2d');

        ctx.fillStyle = 'grey';

        let midX: number = this.xPos+this.dim/2;
        let midY: number = this.yPos+this.dim/2;

        ctx.translate(midX, midY);
        ctx.rotate(this.uVecDir.getDirRad());
        ctx.translate(-midX, -midY);

        ctx.fillRect(this.xPos, this.yPos, this.dim, this.dim);
        ctx.resetTransform()
    }


}