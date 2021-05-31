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

    getLength(): number {
        return Math.sqrt((this.startX-this.endX)**2 + (this.startY-this.endY)**2);
    }

    setData(startX: number, startY: number, uVec: UnitVector): void {
        this.startX = startX;
        this.startY = startY;
        this.uVecDir = uVec;
    }

    drawRay2D(canvas: HTMLCanvasElement): void {
        let ctx = canvas.getContext('2d');
        this.calculateEnd();

        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }

    adjust(red: number, green: number, blue: number, amountChange: number) {
        let r = red - amountChange;
        let g = green - amountChange;
        let b = blue - amountChange;
        return "rgb("+r+", "+g+", "+b+")";
    }

    drawRay3D(canvas: HTMLCanvasElement, sliceWidth: number, sliceCol: number): void {
        let ctx = canvas.getContext('2d');
        //this.calculateEnd();
        let length  = this.getLength();

        let ceiling: number = canvas.height/2 - canvas.height/(length/15);
        let floor: number = canvas.height - ceiling;

        ctx.fillStyle = this.adjust(175, 175, 175, length/3);
        ctx.fillRect(canvas.width-((sliceCol+1)*sliceWidth), ceiling, sliceWidth, floor-ceiling);

        //floor shading
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(canvas.width-((sliceCol+1)*sliceWidth), floor, sliceWidth, canvas.height-floor);
    }
}