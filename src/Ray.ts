import { UnitVector } from "./UnitVector";
import { Map } from "./Map";
import { BlockType } from "./BlockType";

export class Ray {
    uVecDir?: UnitVector;
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    map?: Map;

    constructor(map: Map) {
        this.map = map;
    }

    inBlock(curX: number, curY: number): boolean {
        let cellWidth: number = this.map.getWidth() / this.map.getCols();
        let cellHeight: number = this.map.getHeight() / this.map.getRows();

        let curXBlockIndex: number = Math.ceil(curX/cellWidth)-1;
        let curYBlockIndex: number = Math.ceil(curY/cellHeight)-1;
        
        return this.map.getBlocks()[curYBlockIndex][curXBlockIndex].getBlockType() === BlockType.Wall;
    }

    calculateEnd(): void {
        let curX: number = this.startX;
        let curY: number = this.startY;

        while (!this.inBlock(curX, curY)) {
            curX += this.uVecDir.getX();
            curY += this.uVecDir.getY();
        }

        this.endX = curX;
        this.endY = curY;
    }

    setData(startX: number, startY: number, uVec: UnitVector): void {
        this.startX = startX;
        this.startY = startY;
        this.uVecDir = uVec;
    }

    drawRay(canvas: HTMLCanvasElement): void {
        let ctx = canvas.getContext('2d');

        this.calculateEnd();

        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }
}