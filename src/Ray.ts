import { UnitVector } from "./UnitVector";
import { Map } from "./Map";
import { BlockType } from "./Model/EBlockType";
import { Block } from "./Block";
import { GameState } from "./GameState";
import { Util } from './Util'
import { Bullet } from "./Bullet";
import { Rectangle } from './Model/IRectangle'
import { AreaState } from "./AreaState";
import { EnemyNpc } from "./EnemyNpc";

interface CollisionObject {
    collisionX: number,
    collisionY: number,
    objectHit: Bullet | EnemyNpc,
    length: number
}

export class Ray {
    uVecDir?: UnitVector;
    endX?: number;
    endY?: number;

    gameState?: GameState;
    areaState?: AreaState;
    
    edgeRay?: boolean;
    grd?: CanvasGradient;
    length?: number;

    walkingFrameCount: number = 0;
    walkingFrameIncr: number = 4; //formula for num of up and downs is 1/(2/walingFrameIncr)

    util: Util = new Util();

    bulletCollisionArray?: CollisionObject[];
    enemyNpcCollisionArray?: CollisionObject[];

    randY: number = Math.random()*(350-0); //the sky will never be past midway of screen

    constructor(gameState: GameState, areaState: AreaState, uVecDir: UnitVector) {
        this.gameState = gameState;
        this.areaState = areaState;
        this.uVecDir = uVecDir;

        //floor will be at max half way up the screen i.e canvas3d height / 2
        let color = {r: 0, g:183, b:255};
        this.grd = this.areaState.getCanvas3D().getContext('2d').createLinearGradient(0, this.areaState.geCanvast3DHeight(), 0, this.areaState.geCanvast3DHeight()/2);
        let numPixToAddNewStopColor: number = 2.5;
        let colorChangePerStopColor: number = 1;
        let numIncrs: number = Math.ceil((this.areaState.geCanvast3DHeight()/2)/numPixToAddNewStopColor);
        let stopColorStep: number = 1/numIncrs;

        for(let i =0; i<numIncrs;i++) {
            this.grd.addColorStop(i*stopColorStep, `rgb(${color.r}, ${color.g}, ${color.b})`)
            this.adjustColor(color, {r: 0, g: -colorChangePerStopColor, b: -colorChangePerStopColor*1.4}); //that *1.4 is just there because to acc darken from light to dark blue to black the b part changes at a rate of 1.4
        }
    }

    getEdgeCords(block: Block): Rectangle {
        let cellWidth: number = this.areaState.getCellWidth();
        let cellHeight: number = this.areaState.getCellHeight();

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
            startToEdgeVec = {x: edgeCoords[key].x-this.gameState.getCenterX(), y: edgeCoords[key].y-this.gameState.getCenterY()}
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
        let curX: number = this.gameState.getCenterX();
        let curY: number = this.gameState.getCenterY();

        this.bulletCollisionArray = [];
        this.enemyNpcCollisionArray = [];

        let bullets: Bullet[] = this.gameState.getAllBullets();
        let enemyNpcs: EnemyNpc[] = this.gameState.getAllEnemies();

        while (!this.util.inMapBlock(curX, curY, this.areaState.getMap(), this.areaState.getCellWidth(), this.areaState.getCellHeight())) {
            for (let i =bullets.length-1; i>=0; i--) {
                let bullet: Bullet = bullets[i];
                if (Math.sqrt((curX-bullet.getX())**2+(curY-bullet.getY())**2)< bullet.getDim()) { 
                    this.bulletCollisionArray.push({collisionX: curX, collisionY: curY, objectHit: bullet, length: null});
                    bullets.splice(i, 1);
                }
            }

            for (let i =enemyNpcs.length-1; i>=0; i--) {
                let enemyNpc: EnemyNpc = enemyNpcs[i];
                if (Math.sqrt((curX-enemyNpc.getX())**2+(curY-enemyNpc.getY())**2)< enemyNpc.getDim()) { 
                    this.enemyNpcCollisionArray.push({collisionX: curX, collisionY: curY, objectHit: enemyNpc, length: null});
                    enemyNpcs.splice(i, 1);
                }
            }

            curX += this.uVecDir.getX()/4;
            curY += this.uVecDir.getY()/4;
        }

        this.endX = curX;
        this.endY = curY;

        let curBlock = this.util.getMapBlockFromCoord(curX, curY, this.areaState.getCellWidth(), this.areaState.getCellHeight());
        let blockHit: Block = this.areaState.getMap().getBlocks()[curBlock.y][curBlock.x];
        this.checkEdgeRay(blockHit);
    }

    getAdjustedLength(endX: number, endY:number): number {
        let rayLen: number = Math.sqrt((this.gameState.getCenterX()-endX)**2 + (this.gameState.getCenterY()-endY)**2);

        //lin alg eqn i.e dot prod of two vecs / prod of their magniture = cos of angle between em (mag of both here is 1 tho)
        let cosTheta: number = this.uVecDir.getX()*this.gameState.getCenterDir().getX()+this.uVecDir.getY()*this.gameState.getCenterDir().getY();
        
        return rayLen*cosTheta;
    }

    performRayCalculations(newUVecDir: UnitVector): void {

        this.uVecDir = newUVecDir;

        this.calculateCollisionsAndIfEdge();
        this.length = this.getAdjustedLength(this.endX, this.endY);

        this.bulletCollisionArray.forEach(coll => coll.length = this.getAdjustedLength(coll.collisionX, coll.collisionY))
        this.enemyNpcCollisionArray.forEach(coll => coll.length = this.getAdjustedLength(coll.collisionX, coll.collisionY))

        //walking frame incr controls how many pix the screen moves up and down per frame (so walking count is b/w osscilates b/w 0 and 60) while player moves
        //so need to set it different dep on if crouching, walking or running

        //first normalzie walkign frame incr to 1 and then multip by factor
        //cant just say = 3 or = 6 cause they mighta been a neg num before
        if (this.gameState.isPlayerCrouching()) {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=2;
        } else if (this.gameState.isPlayerRunning()) {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=8;
        } else {
            this.walkingFrameIncr = this.walkingFrameIncr/Math.abs(this.walkingFrameIncr);
            this.walkingFrameIncr*=4;
        }

        if (!this.gameState.isPlayerMoving()) {
            this.walkingFrameCount = 0;
        } else if(this.walkingFrameCount <= 60 && this.walkingFrameCount >= 0) {
            this.walkingFrameCount += this.walkingFrameIncr;
        } else {
            this.walkingFrameIncr*=-1;
            this.walkingFrameCount += this.walkingFrameIncr;
        }
    }

    drawRay2D(): void {
        let ctx = this.areaState.getCanvas2D().getContext('2d');

        if (this.gameState.getCenterDir().getDirRad() == this.uVecDir.getDirRad()) { //this is the center col
            ctx.strokeStyle = "#FF0000";
        } else {
            ctx.strokeStyle = "black";
        }
        ctx.beginPath();
        ctx.moveTo(this.gameState.getCenterX(), this.gameState.getCenterY());

        if(this.bulletCollisionArray.length > 0) {
            ctx.strokeStyle = 'blue';
            ctx.lineTo(this.bulletCollisionArray[0].collisionX, this.bulletCollisionArray[0].collisionY);
            ctx.stroke();
            ctx.strokeStyle = 'green';
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();
        } else {
            ctx.strokeStyle = "black";
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();
        }
    }

    adjustColor(startColor: {r, g, b}, colorChange: {r, g, b}) {
        startColor.r = Math.max(startColor.r + colorChange.r, 0);
        startColor.g = Math.max(startColor.g + colorChange.g, 0);
        startColor.b= Math.max(startColor.b + colorChange.b, 0);
    }

    drawRay3D(sliceWidth: number, sliceCol: number): void {
        let ctx = this.areaState.getCanvas3D().getContext('2d');
        let canvas3DHeight = this.areaState.geCanvast3DHeight();

        //crouching and running animation
        let crouchingPixhift: number = -300;
        let crouchingFactor: number = crouchingPixhift*(1/(this.length/12)); //need to factor in length of ray because clsoer stuff gets more tall than stuff thats further away
        let walkingFactor: number = this.walkingFrameCount/10;

        //calculating ceiling and floor given length of ray + walking and crouching animation
        let ceiling: number = canvas3DHeight/2 - canvas3DHeight/(this.length/12) + (this.gameState.isPlayerCrouching() ? crouchingFactor : 0) + walkingFactor;
        let floor: number = canvas3DHeight - ceiling + walkingFactor*2 + (this.gameState.isPlayerCrouching() ? crouchingFactor*2 : 0);

        let distFromCeilToFloor: number = floor-ceiling;

        //SKY COLUMN
        ctx.fillStyle = 'black';
        ctx.fillRect(((sliceCol)*sliceWidth), 0, sliceWidth, ceiling);


        //STARS IN SKY
        ctx.fillStyle = "white";
        ctx.fillRect((sliceCol)*sliceWidth, this.randY, 1, 1);

        //wall shading based on ray length
        let color = {r:175, g:175, b:175};
        this.adjustColor(color, {r: -this.length/3.5, g: -this.length/3.5, b: -this.length/3.5})

        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`

        //coloring center col and edge cols differently
        if (Math.abs(this.gameState.getCenterDir().getDirRad()-this.uVecDir.getDirRad()) <= 0.0075) {
            ctx.fillStyle = "#FF0000";
        } else if (this.edgeRay){
            let color = {r:125, g:125, b:125};
            this.adjustColor(color, {r: -this.length/3.5, g: -this.length/3.5, b: -this.length/3.5})
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
        }

        //WALL COLUMN
        ctx.fillRect(((sliceCol)*sliceWidth), ceiling, sliceWidth, distFromCeilToFloor);

        //FLOOR COLUMN
        ctx.fillStyle = this.grd;
        ctx.fillRect(((sliceCol)*sliceWidth), floor, sliceWidth, canvas3DHeight-floor);

        //BULLET + ENEMY NPC COLUMN
                   
        //cant use the ceiling and floor from above since the crouching and walking shift mess stuff up
        //all we really want is a floor and ceiling rel to center of screen but crouchign shift makes stuff off center
        //closer stuff will go up more than farther stuff and be even more off center
        let ceil: number = canvas3DHeight/2 - canvas3DHeight/(this.length/12) + walkingFactor;
        let flr: number = canvas3DHeight - ceil  + walkingFactor*2;

        let collisionObjects: CollisionObject[] = this.bulletCollisionArray.concat(this.enemyNpcCollisionArray);
        collisionObjects.sort((a, b) => {
            if (a.length < b.length) {
                return 1;
            } else if (a.length > b.length) {
                return -1;
            } 
            return 0;
        })

        collisionObjects.forEach(coll => {

            let mid: number = (flr-ceil)/2+ceil;
            let lengthToCollidedObj: number = coll.length!=null ? coll.length : 10; //safety mech
            let crouchedObjShift: number = crouchingPixhift*(1/(lengthToCollidedObj/12));
            let shiftFromMid: number = -1;
            let shiftFromMidCeilingFactor: number = 1;
            let color = {r: 0, g:0, b:0};

            //BULLET SPECIFIC
            if (coll.objectHit instanceof Bullet) {
                let crouchedBullet: boolean = (<Bullet>coll.objectHit).getCrouchedBullet();
                if (!this.gameState.isPlayerCrouching()) {
                    if (crouchedBullet) {
                        mid += crouchedObjShift*-1;
                    }
                } else {
                    if (!crouchedBullet) {
                        mid += crouchedObjShift;
                    }
                }
                shiftFromMid = canvas3DHeight/(lengthToCollidedObj)
            } else if (coll.objectHit instanceof EnemyNpc) {
                if (this.gameState.isPlayerCrouching()) {
                    mid += crouchedObjShift;
                }
                shiftFromMid = canvas3DHeight/(lengthToCollidedObj/12)
                shiftFromMidCeilingFactor = 4; // we want the enemy npc to be a lil over half the height of wall
            }

            let collidedObjCeil = mid-shiftFromMid/shiftFromMidCeilingFactor;
            let collidedObjFloor = mid+shiftFromMid;
    
            //BULLET SPECIFIC
            if (coll.objectHit instanceof Bullet) { 
                color = {r: 224, g:86, b:0};
                this.adjustColor(color, {r: -((lengthToCollidedObj/2)*2.6), g: -lengthToCollidedObj/2, b: 0})
        
                ctx.fillStyle = 'white';
                ctx.fillRect(((sliceCol)*sliceWidth), collidedObjCeil-0.5, sliceWidth, (collidedObjFloor-collidedObjCeil)+1);
            } else if (coll.objectHit instanceof EnemyNpc) {
                color = {r: 224, g:86, b:0};
                this.adjustColor(color, {r: -((lengthToCollidedObj/2)*2.6), g: -lengthToCollidedObj/2, b: 0})
            }
    
            ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
            ctx.fillRect(((sliceCol)*sliceWidth), collidedObjCeil, sliceWidth, collidedObjFloor-collidedObjCeil);
        });
    }
}