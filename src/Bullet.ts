import { BlockType } from "./BlockType";
import { Map } from "./Map";
import { MapSizeInfo } from "./MapSizeInfo.interface";
import { UnitVector } from "./UnitVector";

export class Bullet {
    xPos?: number;
    yPos?: number;
    uVecDir?: UnitVector;
    velocity: number = 5;
    canvas2D?: HTMLCanvasElement;
    dim: number = 5; //i.e square side length
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

    checkInBlock(map: Map): boolean {
        let midX: number = this.xPos+this.dim/2;
        let midY: number = this.yPos+this.dim/2;

        //checking left side
        let curX: number = midX - this.dim/2 - 0.5;
        let curY: number = midY;

        if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
            return true;
        }

        //right side
        curX = midX + this.dim/2 + 0.5;
        curY = midY;

        if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
            return true;
        }

        //top side
        curX = midX;
        curY = midY + this.dim/2 + 0.5;

        if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
            return true;
        }

        //bottom side
        curX = midX;
        curY = midY - this.dim/2 - 0.5;

        if (map.getBlocks()[this.getCurBlock(curX, curY).y][this.getCurBlock(curX, curY).x].getBlockType() === BlockType.Wall) {
            return true;
        }

        return false;
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

        ctx.fillRect(this.xPos, this.yPos, this.xPos+this.dim, this.yPos+this.dim);
    }


}