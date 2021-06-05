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
    grd?: CanvasGradient;
    playerMoving: boolean = false;
    walkingFrameCount: number = 0;
    walkingFrameIncr: number = 6;
    playerCrouching: boolean = false;

    constructor(map: Map, canvas2D: HTMLCanvasElement, canvas3D: HTMLCanvasElement) {
        this.map = map;
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;

        //floor will be at max half way up the screen i.e canvas3d height / 2
        let color = {r: 0, g:183, b:255};
        this.grd = canvas3D.getContext('2d').createLinearGradient(0, canvas3D.height, 0, canvas3D.height/2);
        let numPixToAddNewStopColor: number = 2.5;
        let colorChangePerStopColor: number = 1;
        let numIncrs: number = Math.ceil((canvas3D.height/2)/numPixToAddNewStopColor);
        let stopColorStep: number = 1/numIncrs;

        for(let i =0; i<numIncrs;i++) {
            this.grd.addColorStop(i*stopColorStep, `rgb(${color.r}, ${color.g}, ${color.b})`)
            this.adjustColor(color, {r: 0, g: -colorChangePerStopColor, b: -colorChangePerStopColor*1.4});
        }
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

    setData(startX: number, startY: number, uVec: UnitVector, centerUVecRef: UnitVector, playerMoving: boolean, playerCrouching: boolean): void {
        this.startX = startX
        this.startY = startY;
        this.uVecDir = uVec;
        this.centerUVecRef = centerUVecRef;
        this.playerMoving = playerMoving;
        this.playerCrouching = playerCrouching;

        if (playerCrouching) {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=3;
        } else {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=6;
        }

        if (!playerMoving) {
            this.walkingFrameCount = 0;
        } else if(this.walkingFrameCount <= 60 && this.walkingFrameCount >= 0) {
            this.walkingFrameCount += this.walkingFrameIncr;
        } else {
            this.walkingFrameIncr*=-1;
            this.walkingFrameCount += this.walkingFrameIncr;
        }
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

    adjustColor(startColor: {r, g, b}, colorChange: {r, g, b}) {
        startColor.r = Math.max(startColor.r + colorChange.r, 0);
        startColor.g = Math.max(startColor.g + colorChange.g, 0);
        startColor.b= Math.max(startColor.b + colorChange.b, 0);
    }

    drawRay3D(sliceWidth: number, sliceCol: number): void {
        let ctx = this.canvas3D.getContext('2d');
        //this.calculateEnd();
        let length = this.getAdjustedLength();

        let crouchingPixhift: number = this.playerCrouching ? -250 : 0;
        let crouchingFactor: number = crouchingPixhift*(1/(length/12)); //need to factor in length of ray because clsoer stuff gets more tall than stuff thats further away
        let walkingFactor: number = this.walkingFrameCount/10;

        let ceiling: number = this.canvas3D.height/2 - this.canvas3D.height/(length/12) + walkingFactor + crouchingFactor;
        let floor: number = this.canvas3D.height - ceiling + walkingFactor*2 + crouchingFactor*2;

        let color = {r:175, g:175, b:175};
        this.adjustColor(color, {r: -length/3.5, g: -length/3.5, b: -length/3.5})

        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
        if (this.centerUVecRef.getDirRad() == this.uVecDir.getDirRad()) {
            ctx.fillStyle = "#FF0000";
        }
        ctx.fillRect(((sliceCol)*sliceWidth), ceiling, sliceWidth, floor-ceiling);

        //floor shading 1
        // let floorLength: number = this.canvas3D.height-floor;
        // let curColor = {r: 0, g:183, b:255};
        // let incrHeight: number = 35;
        // let incr = Math.ceil(floorLength/incrHeight);

        // for(let i =1; i<=incr; i++) {
        //     let incrDrawStartY: number = this.canvas3D.height-i*incrHeight;
        //     let incrDrawHeight: number = incrHeight;
        //     if (i==incr) { //special case in case last part of floor at top isnt acc incr height pixels
        //         incrDrawStartY = floor;
        //         incrDrawHeight = (floorLength) % incrHeight;
        //     }
        //     let grd = ctx.createLinearGradient(0, incrDrawStartY+incrDrawHeight, 0, incrDrawStartY);
            
        //     grd.addColorStop(0, `rgb(${curColor.r}, ${curColor.g}, ${curColor.b})`);
        //     this.adjustColor(curColor, -15);
        //     grd.addColorStop(1, `rgb(${curColor.r}, ${curColor.g}, ${curColor.b})`);
        //     ctx.fillStyle = grd;
        //     ctx.fillRect(((sliceCol)*sliceWidth), incrDrawStartY, sliceWidth, incrDrawHeight);
        // }

        //floor shading 2
        ctx.fillStyle = this.grd;
        ctx.fillRect(((sliceCol)*sliceWidth), floor, sliceWidth, this.canvas3D.height-floor);
    }
}