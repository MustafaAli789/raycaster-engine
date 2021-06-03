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
    canvas2D?: HTMLCanvasElement;
    canvas3D?: HTMLCanvasElement;
    centerUVecRef?: UnitVector;

    constructor(map: Map, canvas2D: HTMLCanvasElement, canvas3D: HTMLCanvasElement) {
        this.map = map;
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
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

    setData(startX: number, startY: number, uVec: UnitVector, centerUVecRef: UnitVector): void {
        this.startX = startX
        this.startY = startY;
        this.uVecDir = uVec;
        this.centerUVecRef = centerUVecRef;
    }

    drawRay2D(): void {
        let ctx = this.canvas2D.getContext('2d');
        this.calculateEnd();

        if (this.centerUVecRef.getDirRad() == this.uVecDir.getDirRad()) { //this is the center col
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

    drawRay3D(sliceWidth: number, sliceCol: number): void {
        let ctx = this.canvas3D.getContext('2d');
        //this.calculateEnd();
        let length = this.getAdjustedLength();

        let ceiling: number = this.canvas3D.height/2 - this.canvas3D.height/(length/12);
        let floor: number = this.canvas3D.height - ceiling;

        ctx.fillStyle = this.adjust(175, 175, 175, length/3);
        if (this.centerUVecRef.getDirRad() == this.uVecDir.getDirRad()) {
            ctx.fillStyle = "#FF0000";
        }
        ctx.fillRect(((sliceCol)*sliceWidth), ceiling, sliceWidth, floor-ceiling);

        //floor shading
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(((sliceCol)*sliceWidth), floor, sliceWidth, this.canvas3D.height-floor);
    }
}