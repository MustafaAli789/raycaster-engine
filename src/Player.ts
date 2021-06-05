import { Map } from './Map';
import { BlockType } from './BlockType';
import { UnitVector } from './UnitVector'
export class Player {
    xPos?: number;
    yPos?: number;
    standingVel: number = 2;
    crouchingVel: number = 1;
    standingAngularVel: number = 3;
    crouchingAngularVel: number = 1.5;
    dirUVec?: UnitVector; //uses degree angle
    map?: Map;
    rad: number = 2;
    keysState: {} = {};
    canvas3D?: HTMLCanvasElement;
    canvas2D?: HTMLCanvasElement;
    curMousePosX: number = 0;
    audio?: HTMLAudioElement;

    constructor(xPos: number, yPos: number, startingDirUVec: UnitVector, map: Map, canvas3D: HTMLCanvasElement, canvas2D: HTMLCanvasElement, audio: HTMLAudioElement) {
        this.xPos= xPos;
        this.yPos = yPos;
        this.dirUVec = startingDirUVec;
        this.map = map;
        this.canvas3D = canvas3D;
        this.canvas2D = canvas2D;
        this.audio = audio;

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'c':
                    this.keysState['c'] = false;
                    break;
                case 'w':
                    this.audio.pause();
                    this.audio.currentTime = 0;
                    clearInterval(this.keysState['w']);
                    this.keysState['w'] = null;
                    break;
                case 's':
                    clearInterval(this.keysState['s']);
                    this.keysState['s'] = null;
                    break;
                case 'a':
                    clearInterval(this.keysState['a']);
                    this.keysState['a'] = null;
                    break;
                case 'd':
                    clearInterval(this.keysState['d']);
                    this.keysState['d'] = null;
                    break;
            }
        });
        
        window.addEventListener('mousemove', (e) => {
            this.curMousePosX = e.clientX;
        })

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'c':
                    this.keysState['c'] = true;
                    break;
                case 'w':
                    this.audio.play();
                    if (!this.keysState['w']) {
                        this.keysState['w'] = setInterval(() => {
                            this.moveForward();
                        }, 25)
                    }
                    break;
                case 's':
                    if (!this.keysState['s']) {
                        this.keysState['s'] = setInterval(() => {
                            this.moveBackward();
                        }, 25)
                    }
                    break;
                case 'a':
                    if (!this.keysState['a']) {
                        this.keysState['a'] = setInterval(() => {
                            this.rotate('LEFT');
                        }, 25)
                    }
                    break;
                case 'd':
                    if (!this.keysState['d']) {
                        this.keysState['d'] = setInterval(() => {
                            this.rotate('RIGHT');
                        }, 25)
                    }
                    break;
            }
        });

    }

    isPlayerMoving(): boolean {
        return this.keysState['w'] || this.keysState['s'];
    }

    isPlayerCrouching(): boolean {
        return this.keysState['c'];
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
        let vel: number = this.keysState['c'] ? this.crouchingAngularVel : this.standingAngularVel;
        if (dir === 'LEFT') {
            this.dirUVec.updateDir(-vel);
        } else if(dir === 'RIGHT') {
            this.dirUVec.updateDir(vel);
        }
    }

    moveForward():void {
        let vel: number = this.keysState['c'] ? this.crouchingVel : this.standingVel;

        let changeX: number = vel*this.dirUVec.getX();
        let changeY: number = vel*this.dirUVec.getY();
        
        if (!this.inBlock(this.xPos + changeX, this.yPos + changeY)) {
            this.yPos += vel*this.dirUVec.getY();
            this.xPos += vel*this.dirUVec.getX();
        }
    }

    moveBackward(): void {
        let vel: number = this.keysState['c'] ? this.crouchingVel : this.standingVel;

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