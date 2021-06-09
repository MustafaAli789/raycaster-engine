import { Map } from './Map';
import { BlockType } from './BlockType';
import { UnitVector } from './UnitVector'
import { AudioControl } from './AudioContro';
import {MapSizeInfo} from './MapSizeInfo.interface'

//not using WASD because it was causing problems
//specifically when crouching + moving forward/backward and then trying to rotatae right (wouldnt rotate but for some reason rotate left worked)
enum KEYS {
    UP = 'w', LEFT_ROTATION = 'a', DOWN = 's', RIGHT_ROTATION = 'd', CROUCH = 'c', RUN = ' '
}

export class Player {
    xPos?: number;
    yPos?: number;

    standingVel: number = 1.5;
    crouchingVel: number = 0.75;
    runningVel: number = 4;
    standingAngularVel: number = 3;
    crouchingAngularVel: number = 1.5;

    dirUVec?: UnitVector; //uses degree angle
    map?: Map;
    playerCircleRadius: number = 2;
    keysState: {} = {};
    canvas2D?: HTMLCanvasElement;
    audioControl?: AudioControl;
    mapSizeInfo?: MapSizeInfo;

    
    constructor(xPos: number, yPos: number, startingDirUVec: UnitVector, map: Map, canvas2D: HTMLCanvasElement, audioControl: AudioControl, mapSizeInfo: MapSizeInfo) {
        this.xPos= xPos;
        this.yPos = yPos;
        this.dirUVec = startingDirUVec;
        this.map = map;
        this.canvas2D = canvas2D;
        this.audioControl = audioControl;
        this.mapSizeInfo = mapSizeInfo;

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case KEYS.RUN:
                    //release the run key only does anything when we are cur running but not crouching
                    //we dont want to change audio to walking when we are crouching+moving and just press and rlease the run key
                    if(!this.keysState[KEYS.CROUCH]) { 
                        this.audioControl.setAudioWalking();
                        this.keysState[KEYS.RUN] = false;
                    }
                    break;
                case KEYS.CROUCH:
                    //we dont want someone to press and release crouch key while running and change audio to walking
                    if (!this.keysState[KEYS.RUN]) {
                        this.audioControl.setAudioWalking();
                        this.keysState[KEYS.CROUCH] = false;
                    }
                    break;
                case KEYS.UP:
                    //dont want someone to press and release up while moving back and stop audio
                    if (!this.keysState[KEYS.DOWN]) {
                        this.audioControl.stop();
                        clearInterval(this.keysState[KEYS.UP]);
                        this.keysState[KEYS.UP] = null;
                    }
                    break;
                case KEYS.DOWN:
                    //dont want someone to press and release down while moving forward and stop audio
                    if (!this.keysState[KEYS.UP]) {
                        this.audioControl.stop();
                        clearInterval(this.keysState[KEYS.DOWN]);
                        this.keysState[KEYS.DOWN] = null;
                    }
                    break;
                case KEYS.LEFT_ROTATION:
                    clearInterval(this.keysState[KEYS.LEFT_ROTATION]);
                    this.keysState[KEYS.LEFT_ROTATION] = null;
                    break;
                case KEYS.RIGHT_ROTATION:
                    clearInterval(this.keysState[KEYS.RIGHT_ROTATION]);
                    this.keysState[KEYS.RIGHT_ROTATION] = null;
                    break;
            }
        });
        
        // window.addEventListener('mousemove', (e) => {
        //     this.curMousePosX = e.clientX;
        // })

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case KEYS.RUN:
                    if (!this.keysState[KEYS.CROUCH]) { //cant run when crouching
                        this.audioControl.setAudioRunning();
                        this.keysState[KEYS.RUN] = true;
                    }
                    break;
                case KEYS.CROUCH:
                    if (!this.keysState[KEYS.RUN]) { //cant get from running to crouch
                        this.audioControl.setAudioCrouching();
                        this.keysState[KEYS.CROUCH] = true;
                    }
                    break;
                case KEYS.UP:
                    if (this.keysState[KEYS.DOWN]) return; //cant go forward and back at same time
                    //so if ur already crouching and then start moving, audio wont overwrite to walking standin audio
                    //similar idea for run
                    if (!this.keysState[KEYS.CROUCH] && !this.keysState[KEYS.RUN]) { 
                        this.audioControl.setAudioWalking();
                    }
                    this.audioControl.play();
                    if (!this.keysState[KEYS.UP]) {
                        this.keysState[KEYS.UP] = setInterval(() => {
                            this.moveForward();
                        }, 25)
                    }
                    break;
                case KEYS.DOWN: 
                    if (this.keysState[KEYS.UP]) return; //cant go forward and back at same time
                    //so if ur already crouching and then start moving, audio wont overwrite to walking standin audio
                    //similar idea for run
                    if (!this.keysState[KEYS.CROUCH] && !this.keysState[KEYS.RUN]) {
                        this.audioControl.setAudioWalking();
                    }
                    this.audioControl.play();
                    if (!this.keysState[KEYS.DOWN]) {
                        this.keysState[KEYS.DOWN] = setInterval(() => {
                            this.moveBackward();
                        }, 25)
                    }
                    break;
                case KEYS.LEFT_ROTATION:
                    if (!this.keysState[KEYS.LEFT_ROTATION]) {
                        this.keysState[KEYS.LEFT_ROTATION] = setInterval(() => {
                            this.rotate('LEFT');
                        }, 25)
                    }
                    break;
                case KEYS.RIGHT_ROTATION:
                    if (!this.keysState[KEYS.RIGHT_ROTATION]) {
                        this.keysState[KEYS.RIGHT_ROTATION] = setInterval(() => {
                            this.rotate('RIGHT');
                        }, 25)
                    }
                    break;
            }
        });

    }

    isPlayerMoving(): boolean {
        return this.keysState[KEYS.UP] || this.keysState[KEYS.DOWN];
    }

    isPlayerCrouching(): boolean {
        return this.keysState[KEYS.CROUCH];
    }

    isPlayerRunning(): boolean {
        return this.keysState[KEYS.RUN];
    }

    inBlock(curX: number, curY: number): boolean {
        let curXBlockIndex: number = Math.ceil(curX/this.mapSizeInfo.cellWidth)-1;
        let curYBlockIndex: number = Math.ceil(curY/this.mapSizeInfo.cellHeight)-1;
        
        return this.map.getBlocks()[curYBlockIndex][curXBlockIndex].getBlockType() === BlockType.Wall;
    }

    // rotateOnMousePos(canvas: HTMLCanvasElement, dirForward: boolean):void {
    //     let rect = canvas.getBoundingClientRect();
    //     let xPos: number = this.curMousePosX - rect.left;
    //     if (xPos < canvas.width/3) {
    //         this.dirUVec.updateDir(dirForward ? -this.angularVelocity : this.angularVelocity);
    //     } else if (xPos > 2*canvas.width/3) {
    //         this.dirUVec.updateDir(dirForward ? this.angularVelocity : -this.angularVelocity);
    //     }
    // }

    rotate(dir: string): void {
        let vel: number = this.keysState[KEYS.CROUCH] ? this.crouchingAngularVel : this.standingAngularVel;
        if (dir === 'LEFT') {
            this.dirUVec.updateDir(-vel);
        } else if(dir === 'RIGHT') {
            this.dirUVec.updateDir(vel);
        }
    }

    //crouching takes prio over running
    moveForward():void {
        let vel: number = this.keysState[KEYS.CROUCH] ? this.crouchingVel : (this.keysState[KEYS.RUN] ? this.runningVel : this.standingVel);

        let changeX: number = vel*this.dirUVec.getX();
        let changeY: number = vel*this.dirUVec.getY();
        
        if (!this.inBlock(this.xPos + changeX, this.yPos + changeY)) {
            this.yPos += vel*this.dirUVec.getY();
            this.xPos += vel*this.dirUVec.getX();
        }
    }

    //crouching takes prio over running
    moveBackward(): void {
        let vel: number = this.keysState[KEYS.CROUCH] ? this.crouchingVel : (this.keysState[KEYS.RUN] ? this.runningVel : this.standingVel);

        let changeX: number = -vel*this.dirUVec.getX();
        let changeY: number = -vel*this.dirUVec.getY();

        if (!this.inBlock(this.xPos + changeX, this.yPos + changeY)) {
            this.yPos -= vel*this.dirUVec.getY();
            this.xPos -= vel*this.dirUVec.getX();
        }       
    }

    draw2D(): void {
        let ctx = this.canvas2D.getContext('2d');
        let radAngle: number = this.dirUVec.getDirRad();
        
        ctx.translate(this.xPos, this.yPos);
        ctx.rotate(radAngle);
        ctx.translate(-this.xPos, -this.yPos);
        
        //ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
       
        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.playerCircleRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    getUnitVec(): UnitVector {
        return this.dirUVec;
    }

    getXMid(): number {
        return this.xPos;
    }

    getYMid(): number {
        return this.yPos;
    }
}