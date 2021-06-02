import { Map } from './Map';
import { BlockType } from './BlockType';
import { UnitVector } from './UnitVector'
export class Player {
    xPos?: number;
    yPos?: number;
    velocity: number = 2;
    angularVelocity: number = 5;
    dirUVec?: UnitVector; //uses degree angle
    map?: Map;
    rad: number = 2;
    keysState: {} = {};
    canvas3D?: HTMLCanvasElement;
    canvas2D?: HTMLCanvasElement;
    curMousePosX: number = 0;

    constructor(xPos: number, yPos: number, startingDirUVec: UnitVector, map: Map, canvas3D: HTMLCanvasElement, canvas2D: HTMLCanvasElement) {
        this.xPos= xPos;
        this.yPos = yPos;
        this.dirUVec = startingDirUVec;
        this.map = map;
        this.canvas3D = canvas3D;
        this.canvas2D = canvas2D;

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'w':
                    this.keysState['w'] = 0;
                    break;
                case 's':
                    this.keysState['s'] = 0;
                    break;
                case 'a':
                    this.keysState['a'] = 0;
                    break;
                case 'd':
                    this.keysState['d'] = 0;
                    break;
            }
        });
        
        window.addEventListener('mousemove', (e) => {
            this.curMousePosX = e.clientX;
        })

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'w':
                    if (this.keysState['a'] === 1) {
                        this.dirUVec.updateDir(-this.angularVelocity);
                    }
                    if (this.keysState['d'] === 1) {
                        this.dirUVec.updateDir(this.angularVelocity);
                    }
                    this.rotateOnMousePos(this.canvas3D, true);
                    this.moveForward();
                    this.keysState['w'] = 1;
                    break;
                case 's':
                    if (this.keysState['a'] === 1) {
                        this.dirUVec.updateDir(-this.angularVelocity);
                    }
                    if (this.keysState['d'] === 1) {
                        this.dirUVec.updateDir(this.angularVelocity);
                    }
                    this.rotateOnMousePos(this.canvas3D, false);
                    this.moveBackward();
                    this.keysState['s'] = 1;
                    break;
                case 'a':
                    if (this.keysState['w'] === 1) {
                        this.moveForward();
                    }
                    if (this.keysState['s'] === 1) {
                        this.moveBackward();
                    }
                    this.dirUVec.updateDir(-this.angularVelocity);
                    this.keysState['a'] = 1;
                    break;
                case 'd':
                    if (this.keysState['w'] === 1) {
                        this.moveForward();
                    }
                    if (this.keysState['s'] === 1) {
                        this.moveBackward();
                    }
                    this.dirUVec.updateDir(this.angularVelocity);
                    this.keysState['d'] = 1;
                    break;
            }
        });

    }

    inBlock(curX: number, curY: number): boolean {
        let cellWidth: number = this.map.getWidth() / this.map.getCols();
        let cellHeight: number = this.map.getHeight() / this.map.getRows();

        let curXBlockIndex: number = Math.ceil(curX/cellWidth)-1;
        let curYBlockIndex: number = Math.ceil(curY/cellHeight)-1;
        
        return this.map.getBlocks()[curYBlockIndex][curXBlockIndex].getBlockType() === BlockType.Wall;
    }

    rotateOnMousePos(canvas: HTMLCanvasElement, dirForward: boolean):void {
        let rect = canvas.getBoundingClientRect();
        let xPos: number = this.curMousePosX - rect.left;
        if (xPos < canvas.width/3) {
            this.dirUVec.updateDir(dirForward ? -this.angularVelocity : this.angularVelocity);
        } else if (xPos > 2*canvas.width/3) {
            this.dirUVec.updateDir(dirForward ? this.angularVelocity : -this.angularVelocity);
        }
    }

    moveForward():void {

        let changeX: number = this.velocity*this.dirUVec.getX();
        let changeY: number = this.velocity*this.dirUVec.getY();
        
        if (!this.inBlock(this.xPos + changeX, this.yPos + changeY)) {
            this.yPos += this.velocity*this.dirUVec.getY();
            this.xPos += this.velocity*this.dirUVec.getX();
        }
    }

    moveBackward(): void {
        let changeX: number = -this.velocity*this.dirUVec.getX();
        let changeY: number = -this.velocity*this.dirUVec.getY();

        if (!this.inBlock(this.xPos + changeX, this.yPos + changeY)) {
            this.yPos -= this.velocity*this.dirUVec.getY();
            this.xPos -= this.velocity*this.dirUVec.getX();
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