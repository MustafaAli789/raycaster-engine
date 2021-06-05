import { Map } from './Map';
import { BlockType } from './BlockType';
import { UnitVector } from './UnitVector'
import { AudioControl } from './AudioContro';

enum KEYS {
    UP = 'ArrowUp', LEFT_ROTATION = 'ArrowLeft', DOWN = 'ArrowDown', RIGHT_ROTATION = 'ArrowRight', CROUCH = 'c'
}

export class Player {
    xPos?: number;
    yPos?: number;
    standingVel: number = 1;
    crouchingVel: number = 0.5;
    standingAngularVel: number = 3;
    crouchingAngularVel: number = 1.5;
    dirUVec?: UnitVector; //uses degree angle
    map?: Map;
    rad: number = 2;
    keysState: {} = {};
    canvas3D?: HTMLCanvasElement;
    canvas2D?: HTMLCanvasElement;
    curMousePosX: number = 0;
    audioControl?: AudioControl;
    
    constructor(xPos: number, yPos: number, startingDirUVec: UnitVector, map: Map, canvas3D: HTMLCanvasElement, canvas2D: HTMLCanvasElement, audioControl: AudioControl) {
        this.xPos= xPos;
        this.yPos = yPos;
        this.dirUVec = startingDirUVec;
        this.map = map;
        this.canvas3D = canvas3D;
        this.canvas2D = canvas2D;
        this.audioControl = audioControl;

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case KEYS.CROUCH:
                    this.audioControl.setAudioWalking();
                    this.keysState[KEYS.CROUCH] = false;
                    break;
                case KEYS.UP:
                    this.audioControl.stop();
                    clearInterval(this.keysState[KEYS.UP]);
                    this.keysState[KEYS.UP] = null;
                    break;
                case KEYS.DOWN:
                    this.audioControl.stop();
                    clearInterval(this.keysState[KEYS.DOWN]);
                    this.keysState[KEYS.DOWN] = null;
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
        
        window.addEventListener('mousemove', (e) => {
            this.curMousePosX = e.clientX;
        })

        window.addEventListener('keydown', (e) => {
            console.log(e.key)
            switch(e.key) {
                case KEYS.CROUCH:
                    this.audioControl.setAudioCrouching();
                    this.keysState[KEYS.CROUCH] = true;
                    break;
                case KEYS.UP:
                    this.audioControl.setAudioWalking();
                    this.audioControl.play();
                    if (!this.keysState[KEYS.UP]) {
                        this.keysState[KEYS.UP] = setInterval(() => {
                            this.moveForward();
                        }, 25)
                    }
                    break;
                case KEYS.DOWN:
                    this.audioControl.setAudioWalking();
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
                // case 'ArrowRight':
                //     console.log('yee')
                //     break;
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

    inBlock(curX: number, curY: number): boolean {
        let cellWidth: number = this.map.getWidth() / this.map.getCols();
        let cellHeight: number = this.map.getHeight() / this.map.getRows();

        let curXBlockIndex: number = Math.ceil(curX/cellWidth)-1;
        let curYBlockIndex: number = Math.ceil(curY/cellHeight)-1;
        
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

    moveForward():void {
        let vel: number = this.keysState[KEYS.CROUCH] ? this.crouchingVel : this.standingVel;

        let changeX: number = vel*this.dirUVec.getX();
        let changeY: number = vel*this.dirUVec.getY();
        
        if (!this.inBlock(this.xPos + changeX, this.yPos + changeY)) {
            this.yPos += vel*this.dirUVec.getY();
            this.xPos += vel*this.dirUVec.getX();
        }
    }

    moveBackward(): void {
        let vel: number = this.keysState[KEYS.CROUCH] ? this.crouchingVel : this.standingVel;

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
        ctx.arc(this.xPos, this.yPos, this.rad, 0, 2 * Math.PI, false);
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