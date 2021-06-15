import { BlockType } from "./BlockType";
import { Map } from "./Map";
import { MapSizeInfo } from "./MapSizeInfo.interface";
import { UnitVector } from "./UnitVector";
import { Util } from './Util'
import { Rectangle } from './Rectangle.interface'

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
    velocity: number = 5;
    canvas2D?: HTMLCanvasElement;
    dim: number = 5; //i.e square side length
    mapSizeInfo?: MapSizeInfo;

    util: Util = new Util();
    

    constructor(startX: number, startY: number, uVecDir: UnitVector, canvas2D: HTMLCanvasElement, mapSizeInfo: MapSizeInfo){
        this.xPos = startX-this.dim/2; //center bullet around player
        this.yPos = startY-this.dim/2; //center bullet around player
        this.uVecDir = uVecDir;
        this.canvas2D = canvas2D;
        this.mapSizeInfo = mapSizeInfo;
    }

    moveBullet(): void {
        this.xPos += this.velocity*this.uVecDir.getX();
        this.yPos += this.velocity*this.uVecDir.getY();
    }

    //this algo expects the y to be relative to origin at bottom left
    pointAfterRotation(unRotatedX: number, unRotatedY: number, clockWiseRotation: number, centerOfRotX: number, centerOfRotY: number): {x: number, y: number} {
        let newX: number = (unRotatedX-centerOfRotX)*Math.cos(-clockWiseRotation)-(unRotatedY-centerOfRotY)*Math.sin(-clockWiseRotation)+centerOfRotX;
        let newY: number = (unRotatedX-centerOfRotX)*Math.sin(-clockWiseRotation)+(unRotatedY-centerOfRotY)*Math.cos(-clockWiseRotation)+centerOfRotY;
        return {x: newX, y: newY};
    }

    //the pont of this method is to project x even spaced vecs out of a side of the bullet (which is a square) and determine if any of those are in a player, ray, or wall
    checkIfBulletSideInObject(side: string, map: Map, mapSizeInfo: MapSizeInfo): ObjectHit {

        //this vec is in the dir of the side of the bullet we care about
        let uVec: UnitVector = new UnitVector(this.uVecDir.getDirDeg());

        let mapHeight: number = mapSizeInfo.cellHeight*mapSizeInfo.rows;

        //the roation algo uses normal cartesian convention of bottom left as (0, 0) so need to inv y
        let inverseY: number = mapHeight-this.yPos;

        let midX: number = this.xPos + this.dim/2;
        let midY: number = inverseY - this.dim/2;

        //assume no rotation and move across top face of bullet from left to right
        //then rotate points with rotation of bullet + additional rotatation dep on side
        //***using special formula for point after rotation: https://math.stackexchange.com/questions/270194/how-to-find-the-vertices-angle-after-rotation --> the second expanded formula
        let curPoint: {x: number, y: number};

        //FORWARD dir is same dir as unit vec for dir bullet is pointing
        if (side === 'LEFT') {
            uVec.updateDir(-90);
        } else if (side === 'RIGHT') {
            uVec.updateDir(90);
        } else if (side === 'BOTTOM') {
            uVec.updateDir(180);
        }

        let numProjections: number = 50;
        let space: number = this.dim/numProjections;

        //really how far out from sied of sqaure we want to go
        let projMag: number = 0.01;

        let projX: number;
        let projY: number;

        for(let i =0; i<=numProjections; i++) {

            curPoint = this.pointAfterRotation(this.xPos+i*space, inverseY, uVec.getDirRad(), midX, midY);
            projX = curPoint.x + uVec.getX()*projMag;
            projY = (mapHeight-curPoint.y) + uVec.getY()*projMag; //re inv y so it follows canvas convention

            if (this.util.inMapBlock(projX, projY, mapSizeInfo, map)) {
                return ObjectHit.Wall;
            }
        }

        return ObjectHit.None;
    }

    checkObjectHit(map: Map, mapSizeInfo: MapSizeInfo): ObjectHit {

        if(this.checkIfBulletSideInObject('FORWARD', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if(this.checkIfBulletSideInObject('LEFT', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if(this.checkIfBulletSideInObject('RIGHT', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }
        if(this.checkIfBulletSideInObject('BOTTOM', map, mapSizeInfo) === ObjectHit.Wall) {
            return ObjectHit.Wall;
        }

        return ObjectHit.None;
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

    getX(): number{
        return this.xPos;
    }

    getY(): number {
        return this.yPos;
    }

    //accounts for rotation
    //A --> B --> C --> D is clockwise around rectangle from top left
    getBoundingBox(mapSizeInfo: MapSizeInfo): Rectangle {

        let mapHeight: number = mapSizeInfo.cellHeight*mapSizeInfo.rows;

        //the roation algo uses normal cartesian convention of bottom left as (0, 0) so need to inv y
        let inverseY: number = mapHeight-this.yPos;

        let midX: number = this.xPos + this.dim/2;
        let midY: number = inverseY - this.dim/2;

        let A: {x: number, y: number} = this.pointAfterRotation(this.xPos, inverseY, this.uVecDir.getDirRad(), midX, midY)
        A.y = (mapHeight - A.y);

        let B: {x: number, y: number} = this.pointAfterRotation(this.xPos+this.dim, inverseY, this.uVecDir.getDirRad(), midX, midY)
        B.y = (mapHeight - B.y);

        let D: {x: number, y: number} = this.pointAfterRotation(this.xPos, inverseY-this.dim, this.uVecDir.getDirRad(), midX, midY)
        D.y = (mapHeight - D.y);

        let C: {x: number, y: number} = this.pointAfterRotation(this.xPos+this.dim, inverseY-this.dim, this.uVecDir.getDirRad(), midX, midY)
        C.y = (mapHeight - C.y);


        return {
            A: A,
            B: B,
            C: C,
            D: D
        }
    }


}