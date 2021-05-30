import { Ray } from "./Ray";
import { Map } from "./Map";
import { UnitVector } from "./UnitVector";

export class Rays {
    rays: Ray[] = [];
    startX?: number;
    startY: number;
    map?: Map;
    centerUVec?: UnitVector;
    degSpread: number = 30;

    constructor(map: Map) {
        this.map = map;
        for (let i =0; i<this.degSpread*2+1; i++) {
            this.rays.push(new Ray(map));
        }
    }

    setData(startX: number, startY: number, centerUVec: UnitVector): void {
        for(let i =0; i < this.degSpread; i++) {
            let uVec: UnitVector = new UnitVector(centerUVec.getDirDeg());
            uVec.updateDir(i+1);
            this.rays[i].setData(startX, startY, uVec);
        }
        for(let i =this.degSpread; i < this.degSpread*2; i++) {
            let uVec: UnitVector = new UnitVector(centerUVec.getDirDeg());
            uVec.updateDir(-(i-this.degSpread)-1);
            this.rays[i].setData(startX, startY, uVec);
        }

        //center ray
        this.rays[this.degSpread*2].setData(startX, startY, new UnitVector(centerUVec.getDirDeg()));
    }

    draw(canvas: HTMLCanvasElement): void {
        this.rays.forEach(ray => ray.drawRay(canvas));
    }


}