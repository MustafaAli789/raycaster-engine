import { Ray } from "./Ray";
import { Map } from "./Map";
import { UnitVector } from "./UnitVector";

export class Rays {
    rays: Ray[] = [];
    startX?: number;
    startY: number;
    map?: Map;
    centerUVec?: UnitVector; //i.e dir of camera
    canvas2D?: HTMLCanvasElement;
    canvas3D?: HTMLCanvasElement;
    fov: number = 90;
    distToProjection: number = 350;
    playerMoving: boolean = false;

    constructor(map: Map, canvas2D: HTMLCanvasElement, canvas3D: HTMLCanvasElement) {
        this.map = map;
        this.canvas2D = canvas2D;
        this.canvas3D = canvas3D;
    }

    //some resources used:
    //https://stackoverflow.com/questions/24173966/raycasting-engine-rendering-creating-slight-distortion-increasing-towards-edges
    //https://gamedev.stackexchange.com/questions/156842/how-can-i-correct-an-unwanted-fisheye-effect-when-drawing-a-scene-with-raycastin/156853#156853
    //https://gamedev.stackexchange.com/questions/97574/how-can-i-fix-the-fisheye-distortion-in-my-raycast-renderer
    //https://www.gamedev.net/forums/topic/272526-raycasting----fisheye-distortion/?page=1
    //so theres two effects, one is the fisheye correction but another is the non linearity of angle increases between rays
    setData(startX: number, startY: number, centerUVec: UnitVector, playerMoving: boolean, playerCrouching: boolean, playerRunning: boolean): void {
        this.distToProjection = this.canvas3D.width/2/(Math.tan(this.toRad(this.fov/2)));
        let counter = 0;
        for(let i =0; i<this.canvas3D.width; i += 1) {
            let ang: number = Math.atan((i-this.canvas3D.width/2)/this.distToProjection) + centerUVec.getDirRad();
            let uVec: UnitVector = new UnitVector(this.toDeg(ang));
            if (this.rays[counter]) {
                this.rays[counter].setData(startX, startY, uVec, centerUVec, playerMoving, playerCrouching, playerRunning);
            } else {
                let newRay: Ray = new Ray(this.map, this.canvas2D, this.canvas3D);
                newRay.setData(startX, startY, uVec, centerUVec, playerMoving, playerCrouching, playerRunning)
                this.rays.push(newRay);
            }
            counter++;
        }
    }

    toRad(deg: number): number {
        return deg*Math.PI/180;
    }

    toDeg(rad: number): number {
        return rad/Math.PI*180;
    }

    draw2D(): void {
        this.rays.forEach(ray => ray.drawRay2D());
    }

    draw3D(): void {
        let raySliceWidth: number = this.canvas3D.width / this.rays.length;
        this.rays.forEach((ray, i) => {
            ray.drawRay3D(raySliceWidth, i);
        })
    }


}