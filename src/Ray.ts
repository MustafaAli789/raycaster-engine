import { UnitVector } from "./UnitVector";
import { Map } from "./Map";
import { BlockType } from "./BlockType";
import { Block } from "./Block";
import { GameState } from "./GameState";
import { Util } from './Util'
import { Bullet } from "./Bullet";
import { Rectangle } from './Rectangle.interface'

export class Ray {
    uVecDir?: UnitVector;
    endX?: number;
    endY?: number;
    gState?: GameState;
    canvas2D?: HTMLCanvasElement;
    canvas3D?: HTMLCanvasElement;
    edgeRay?: boolean;
    grd?: CanvasGradient;
    length?: number;

    walkingFrameCount: number = 0;
    walkingFrameIncr: number = 4; //formula for num of up and downs is 1/(2/walingFrameIncr)

    util: Util = new Util();

    //if these aren not null/undefined, it means a bullet was hit along the way
    bulletHitEndX?: number;
    bulletHitEndY?: number;

    constructor(gState: GameState, canvas2D: HTMLCanvasElement, canvas3D: HTMLCanvasElement, uVecDir: UnitVector) {
        this.gState = gState;
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
        this.uVecDir = uVecDir;

        //floor will be at max half way up the screen i.e canvas3d height / 2
        let color = {r: 0, g:183, b:255};
        this.grd = canvas3D.getContext('2d').createLinearGradient(0, canvas3D.height, 0, canvas3D.height/2);
        let numPixToAddNewStopColor: number = 2.5;
        let colorChangePerStopColor: number = 1;
        let numIncrs: number = Math.ceil((canvas3D.height/2)/numPixToAddNewStopColor);
        let stopColorStep: number = 1/numIncrs;

        for(let i =0; i<numIncrs;i++) {
            this.grd.addColorStop(i*stopColorStep, `rgb(${color.r}, ${color.g}, ${color.b})`)
            this.adjustColor(color, {r: 0, g: -colorChangePerStopColor, b: -colorChangePerStopColor*1.4}); //that *1.4 is just there because to acc darken from light to dark blue to black the b part changes at a rate of 1.4
        }
    }

    getEdgeCords(block: Block): Rectangle {
        let cellWidth: number = this.gState.getMapSizeInfo().cellWidth;
        let cellHeight: number = this.gState.getMapSizeInfo().cellHeight;

        let blockX = cellWidth*block.getCol();
        let blockY = cellHeight*block.getRow();

        return {C: {x: blockX, y: blockY+cellHeight}, 
            D: {x: blockX+cellWidth, y: blockY+cellHeight}, 
            B: {x: blockX+cellWidth, y:blockY}, 
            A: {x: blockX, y: blockY}};
    }

    checkEdgeRay(blockHit: Block): void {
        let edgeCoords = this.getEdgeCords(blockHit);
        this.edgeRay = false;

        let startToEdgeVec: {x: number, y:number} = null;
        let startToEdgeVecMag: number = null;
        let angleBetweenRayAndStartToEdgeVec: number = null;
        let distBetweenRayEndAndStartToEdgeVecEnd: number = null;

        Object.keys(edgeCoords).forEach(key => {
            startToEdgeVec = {x: edgeCoords[key].x-this.gState.getCenterX(), y: edgeCoords[key].y-this.gState.getCenterY()}
            startToEdgeVecMag = Math.sqrt(startToEdgeVec.x**2 + startToEdgeVec.y**2);

            //doing dot prod to get angle between ray vec nad start to edge vec
            angleBetweenRayAndStartToEdgeVec = Math.acos((this.uVecDir.getX()*startToEdgeVec.x+this.uVecDir.getY()*startToEdgeVec.y)/(startToEdgeVecMag))*180/Math.PI;
            

            //dist formula
            distBetweenRayEndAndStartToEdgeVecEnd = Math.sqrt((edgeCoords[key].x-this.endX)**2+(edgeCoords[key].y-this.endY)**2)

            //so both the angle between the cur ray and the projected ray from endge to start has to be within a limit BUT ALSO
            //the dist b/w end of ray and each edge has to be within a limit too
            if (angleBetweenRayAndStartToEdgeVec<=0.1 && distBetweenRayEndAndStartToEdgeVecEnd<=3.5) {
                this.edgeRay = true;
            }
        })
    }

    calculateCollisionsAndIfEdge(): void {
        let curX: number = this.gState.getCenterX();
        let curY: number = this.gState.getCenterY();

        let bullets: Bullet[] = this.gState.getAllBullets();

        while (!this.util.inMapBlock(curX, curY, this.gState.getMapSizeInfo(), this.gState.getMap())) {

            // bullets.forEach(bullet => {
                
            // })

            curX += this.uVecDir.getX()/8;
            curY += this.uVecDir.getY()/8;
        }

        this.endX = curX;
        this.endY = curY;

        let curBlock = this.util.getMapBlockFromCoord(curX, curY, this.gState.getMapSizeInfo());
        let blockHit: Block = this.gState.getMap().getBlocks()[curBlock.y][curBlock.x];
        this.checkEdgeRay(blockHit);
    }

    getAdjustedLength(): number {
        let rayLen: number = Math.sqrt((this.gState.getCenterX()-this.endX)**2 + (this.gState.getCenterY()-this.endY)**2);

        //lin alg eqn i.e dot prod of two vecs / prod of their magniture = cos of angle between em (mag of both here is 1 tho)
        let cosTheta: number = this.uVecDir.getX()*this.gState.getCenterDir().getX()+this.uVecDir.getY()*this.gState.getCenterDir().getY();
        
        return rayLen*cosTheta;
    }

    performRayCalculations(newUVecDir: UnitVector): void {

        this.uVecDir = newUVecDir;

        this.calculateCollisionsAndIfEdge();
        this.length = this.getAdjustedLength();

        //walking frame incr controls how many pix the screen moves up and down per frame (so walking count is b/w osscilates b/w 0 and 60) while player moves
        //so need to set it different dep on if crouching, walking or running

        //first normalzie walkign frame incr to 1 and then multip by factor
        //cant just say = 3 or = 6 cause they mighta been a neg num before
        if (this.gState.isPlayerCrouching()) {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=2;
        } else if (this.gState.isPlayerRunning()) {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=8;
        } else {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=4;
        }

        if (!this.gState.isPlayerMoving()) {
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

        if (this.gState.getCenterDir().getDirRad() == this.uVecDir.getDirRad()) { //this is the center col
            ctx.strokeStyle = "#FF0000";
        } else {
            ctx.strokeStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.gState.getCenterX(), this.gState.getCenterY());
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

        //crouching and running animation
        let crouchingPixhift: number = this.gState.isPlayerCrouching() ? -250 : 0;
        let crouchingFactor: number = crouchingPixhift*(1/(this.length/12)); //need to factor in length of ray because clsoer stuff gets more tall than stuff thats further away
        let walkingFactor: number = this.walkingFrameCount/10;

        //calculating ceiling and floor given length of ray + walking and crouching animation
        let ceiling: number = this.canvas3D.height/2 - this.canvas3D.height/(this.length/12) + walkingFactor + crouchingFactor;
        let floor: number = this.canvas3D.height - ceiling + walkingFactor*2 + crouchingFactor*2;

        //wall shading based on ray length
        let color = {r:175, g:175, b:175};
        this.adjustColor(color, {r: -this.length/3.5, g: -this.length/3.5, b: -this.length/3.5})

        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`

        //coloring center col and edge cols differently
        if (Math.abs(this.gState.getCenterDir().getDirRad()-this.uVecDir.getDirRad()) <= 0.0075) {
            ctx.fillStyle = "#FF0000";
        } else if (this.edgeRay){
            let color = {r:125, g:125, b:125};
            this.adjustColor(color, {r: -this.length/3.5, g: -this.length/3.5, b: -this.length/3.5})
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        }

        //WALL COLUMN
        ctx.fillRect(((sliceCol)*sliceWidth), ceiling, sliceWidth, floor-ceiling);

        //FLOOR COLUMN
        ctx.fillStyle = this.grd;
        ctx.fillRect(((sliceCol)*sliceWidth), floor, sliceWidth, this.canvas3D.height-floor);

        //SKY COLUMN
        ctx.fillStyle = 'black';
        ctx.fillRect(((sliceCol)*sliceWidth), 0, sliceWidth, ceiling);
    }
}