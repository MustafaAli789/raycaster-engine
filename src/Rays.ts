import { Ray } from "./Ray";
import { Map } from "./Map";
import { UnitVector } from "./UnitVector";

export class Rays {
    rays: Ray[] = [];
    startX?: number;
    startY: number;
    map?: Map;
    centerUVec?: UnitVector;
    degSpread: number = 1200;

    constructor(map: Map) {
        this.map = map;
        for (let i =0; i<this.degSpread*2+1; i++) {
            this.rays.push(new Ray(map));
        }
    }

    setData(startX: number, startY: number, centerUVec: UnitVector): void {
        for(let i =0; i < this.degSpread; i++) {
            let uVec: UnitVector = new UnitVector(centerUVec.getDirDeg());
            uVec.updateDir(i*0.05+0.05);
            this.rays[i].setData(startX, startY, uVec, centerUVec, false);
        }
        for(let i =this.degSpread; i < this.degSpread*2; i++) {
            let uVec: UnitVector = new UnitVector(centerUVec.getDirDeg());
            uVec.updateDir(-(i-this.degSpread)*0.05-0.05);
            this.rays[i].setData(startX, startY, uVec, centerUVec, false);
        }

        //center ray
        this.rays[this.degSpread*2].setData(startX, startY, new UnitVector(centerUVec.getDirDeg()), centerUVec, true);
    }

    draw2D(canvas: HTMLCanvasElement): void {
        this.rays.forEach(ray => ray.drawRay2D(canvas));
    }

    draw3D(canvas: HTMLCanvasElement): void {
        let raySliceWidth: number = canvas.width / this.rays.length;
        let colCount = 0; //cols start from right at 0
        for(let i = this.degSpread-1; i>=0; i--) {
            this.rays[i].drawRay3D(canvas, raySliceWidth, colCount);
            colCount++;
        }

        //center ray
        this.rays[this.degSpread*2].drawRay3D(canvas, raySliceWidth, colCount);
        colCount++;

        for(let i = this.degSpread; i<this.degSpread*2; i++) {
            this.rays[i].drawRay3D(canvas, raySliceWidth, colCount);
            colCount++;
        }
    }


}