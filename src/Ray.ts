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
    isCenter: boolean = false;
    centerUVecRef?: UnitVector;

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
            curX += this.uVecDir.getX()/4;
            curY += this.uVecDir.getY()/4;
        }

        this.endX = curX;
        this.endY = curY;
    }

    getAdjustedLength(): number {
        let rayLen: number = Math.sqrt((this.startX-this.endX)**2 + (this.startY-this.endY)**2);

        //lin alg eqn i.e dot prod of two vecs / prod of their magniture = cos of angle between em (mag of both here is 1 tho)
        let cosTheta: number = this.uVecDir.getX()*this.centerUVecRef.getX()+this.uVecDir.getY()*this.centerUVecRef.getY();
        
        return rayLen*cosTheta;
    }

    setData(startX: number, startY: number, uVec: UnitVector, centerUVecRef: UnitVector, isCenter: boolean): void {
        this.startX = startX
        this.startY = startY;
        this.uVecDir = uVec;
        this.isCenter = isCenter;
        this.centerUVecRef = centerUVecRef;
    }

    drawRay2D(canvas: HTMLCanvasElement): void {
        let ctx = canvas.getContext('2d');
        this.calculateEnd();

        if (this.isCenter) {
            ctx.strokeStyle = "#FF0000";
        } else {
            ctx.strokeStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
        ctx.strokeStyle = "black";
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
        let length = this.getAdjustedLength();

        let ceiling: number = canvas.height/2 - canvas.height/(length/12);
        let floor: number = canvas.height - ceiling;

        ctx.fillStyle = this.adjust(175, 175, 175, length/3);
        if (this.isCenter) {
            ctx.fillStyle = "#FF0000";
        }
        ctx.fillRect(((sliceCol)*sliceWidth), ceiling, sliceWidth, floor-ceiling);

        //floor shading
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(((sliceCol)*sliceWidth), floor, sliceWidth, canvas.height-floor);
    }
}