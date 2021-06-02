import { Ray } from "./Ray";
import { Map } from "./Map";
import { UnitVector } from "./UnitVector";

export class Rays {
    rays: Ray[] = [];
    startX?: number;
    startY: number;
    map?: Map;
    centerUVec?: UnitVector;
    fov: number = 90;
    distToProjection: number = 350;

    constructor(map: Map) {
        this.map = map;
    }

    //some resources used:
    //https://stackoverflow.com/questions/24173966/raycasting-engine-rendering-creating-slight-distortion-increasing-towards-edges
    //https://gamedev.stackexchange.com/questions/156842/how-can-i-correct-an-unwanted-fisheye-effect-when-drawing-a-scene-with-raycastin/156853#156853
    //https://gamedev.stackexchange.com/questions/97574/how-can-i-fix-the-fisheye-distortion-in-my-raycast-renderer
    //https://www.gamedev.net/forums/topic/272526-raycasting----fisheye-distortion/?page=1
    //so theres two effects, one is the fisheye correction but another is the non linearity of angle increases between rays
    setData(startX: number, startY: number, centerUVec: UnitVector, canvas: HTMLCanvasElement): void {
        let screen_halflen: number = this.distToProjection*Math.tan(this.fov/2*Math.PI/180);
        let seg_len: number = screen_halflen/(canvas.width/2);

        for(let i =0; i<canvas.width; i++) {
            let ang: number = Math.atan((seg_len*i-screen_halflen)/this.distToProjection) + centerUVec.getDirRad();
            let uVec: UnitVector = new UnitVector(ang*180/Math.PI);
            if (this.rays[i]) {
                this.rays[i].setData(startX, startY, uVec, centerUVec, i === canvas.width/2 ? true: false);
            } else {
                let newRay: Ray = new Ray(this.map);
                newRay.setData(startX, startY, uVec, centerUVec, i === canvas.width/2 ? true: false)
                this.rays.push(newRay);
            }
        }
    }

    draw2D(canvas: HTMLCanvasElement): void {
        this.rays.forEach(ray => ray.drawRay2D(canvas));
    }

    draw3D(canvas: HTMLCanvasElement): void {
        let raySliceWidth: number = canvas.width / this.rays.length;
        let colCount = 0; //cols start from right at 0
        this.rays.forEach((ray, i) => {
            this.rays[i].drawRay3D(canvas, raySliceWidth, i);
        })
    }


}