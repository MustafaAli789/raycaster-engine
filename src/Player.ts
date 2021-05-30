import { Map } from './Map';
export class Player {
    xPos?: number;
    yPos?: number;
    velocity: number = 5;
    angularVelocity: number = 5;
    dir?: number; //degree angle
    map?: Map;
    width: number = 20;
    height: number = 20;
    keysState: {} = {};


    constructor(xPos: number, yPos: number, dir: number, map: Map) {
        this.xPos= xPos;
        this.yPos = yPos;
        this.dir = dir;
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
                        this.dir -= this.angularVelocity;
                    }
                    if (this.keysState['d'] === 1) {
                        this.dir += this.angularVelocity;
                    }
                    this.moveForward();
                    this.keysState['w'] = 1;
                    break;
                case 's':
                    if (this.keysState['a'] === 1) {
                        this.dir -= this.angularVelocity;
                    }
                    if (this.keysState['d'] === 1) {
                        this.dir += this.angularVelocity;
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
                    this.dir -= this.angularVelocity;
                    this.keysState['a'] = 1;
                    break;
                case 'd':
                    if (this.keysState['w'] === 1) {
                        this.moveForward();
                    }
                    if (this.keysState['s'] === 1) {
                        this.moveBackward();
                    }
                    this.dir += this.angularVelocity;
                    this.keysState['d'] = 1;
                    break;
            }
        });

    }

    moveForward():void {
        this.yPos += this.velocity*Math.sin(this.degRad());
        this.xPos += this.velocity*Math.cos(this.degRad());
    }

    moveBackward(): void {
        this.yPos -= this.velocity*Math.sin(this.degRad());
        this.xPos -= this.velocity*Math.cos(this.degRad());
    }

    degRad(): number{
        return this.dir*Math.PI/180;
    }

    draw(canvas: HTMLCanvasElement): void {
        let ctx = canvas.getContext('2d');
        let translationX: number = (this.xPos+this.width/2);
        let translationY: number = (this.yPos+this.height/2);
        let radAngle: number = this.degRad();
        
        ctx.translate(translationX, translationY);
        ctx.rotate(radAngle);
        ctx.translate(-translationX, -translationY);
        
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
        ctx.beginPath();
        ctx.moveTo(translationX, translationY);
        ctx.lineTo(translationX+100, translationY);
        ctx.stroke();

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}