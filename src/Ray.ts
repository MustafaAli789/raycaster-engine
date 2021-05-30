import { UnitVector } from "./UnitVector";
import { Map } from "./Map";
import { BlockType } from "./BlockType";

export class Ray {
    uVecDir?: UnitVector;

    endX?: number;
    endY?: number;
    map?: Map;

    constructor(uVecDir: UnitVector, map: Map) {
        this.uVecDir = uVecDir;
        this.map = map;
    }

    inBlock(curX: number, curY: number): boolean {
        let cellWidth: number = this.map.getWidth() / this.map.getCols();
        let cellHeight: number = this.map.getHeight() / this.map.getRows();

        let curXBlockIndex: number = Math.ceil(curX/cellWidth)-1;
        let curYBlockIndex: number = Math.ceil(curY/cellHeight)-1;
        
        return this.map.getBlocks()[curYBlockIndex][curXBlockIndex].getBlockType() === BlockType.Wall;
    }

    calculateEnd(startX: number, startY: number): void {
        let curX: number = startX;
        let curY: number = startY;

        while (!this.inBlock(curX, curY)) {
            curX += this.uVecDir.getX();
            curY += this.uVecDir.getY();
        }

        this.endX = curX;
        this.endY = curY;
    }

    drawRay(canvas: HTMLCanvasElement, startX: number, startY: number): void {
        let ctx = canvas.getContext('2d');
        this.calculateEnd(startX, startY);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }
}