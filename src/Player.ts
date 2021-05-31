import { Map } from './Map';
import { BlockType } from './BlockType';
import { UnitVector } from './UnitVector'
export class Player {
    xPos?: number;
    yPos?: number;
    velocity: number = 5;
    angularVelocity: number = 5;
    dirUVec?: UnitVector; //uses degree angle
    map?: Map;
    rad: number = 2;
    keysState: {} = {};

    constructor(xPos: number, yPos: number, startingDirUVec: UnitVector, map: Map) {
        this.xPos= xPos;
        this.yPos = yPos;
        this.dirUVec = startingDirUVec;
        this.map = map;

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

        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'w':
                    if (this.keysState['a'] === 1) {
                        this.dirUVec.updateDir(-this.angularVelocity);
                    }
                    if (this.keysState['d'] === 1) {
                        this.dirUVec.updateDir(this.angularVelocity);
                    }
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

    draw(canvas: HTMLCanvasElement): void {
        let ctx = canvas.getContext('2d');
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