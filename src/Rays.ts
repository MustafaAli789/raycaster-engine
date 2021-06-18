import { Ray } from "./Ray";
import { UnitVector } from "./UnitVector";
import { GameState } from "./GameState";
import { Util } from './Util'
import { AreaState } from "./AreaState";

export class Rays {
    rays: Ray[] = [];

    gameState?: GameState;
    areaState?: AreaState;

    centerUVec?: UnitVector; //i.e dir of camera
    fov: number = 90;
    distToProjection: number = 350;

    util: Util = new Util();

    constructor(gameState: GameState, areaState: AreaState) {
        this.gameState = gameState;
        this.areaState = areaState;
    }

    //some resources used:
    //https://stackoverflow.com/questions/24173966/raycasting-engine-rendering-creating-slight-distortion-increasing-towards-edges
    //https://gamedev.stackexchange.com/questions/156842/how-can-i-correct-an-unwanted-fisheye-effect-when-drawing-a-scene-with-raycastin/156853#156853
    //https://gamedev.stackexchange.com/questions/97574/how-can-i-fix-the-fisheye-distortion-in-my-raycast-renderer
    //https://www.gamedev.net/forums/topic/272526-raycasting----fisheye-distortion/?page=1
    //so theres two effects, one is the fisheye correction but another is the non linearity of angle increases between rays
    setupRays(): void {
        let centerUVec: UnitVector = this.gameState.getCenterDir();
        
        this.distToProjection = this.areaState.getCanvas3DWidth()/2/(Math.tan(this.util.toRad(this.fov/2)));
        let counter = 0;
        for(let i =0; i<this.areaState.getCanvas3DWidth(); i += 1) {
            let ang: number = Math.atan((i-this.areaState.getCanvas3DWidth()/2)/this.distToProjection) + centerUVec.getDirRad();
            let uVec: UnitVector = new UnitVector(this.util.toDeg(ang));
            if (this.rays[counter]) {
                this.rays[counter].performRayCalculations(uVec);
            } else {
                let newRay: Ray = new Ray(this.gameState, this.areaState, uVec);
                newRay.performRayCalculations(uVec);
                this.rays.push(newRay);
            }
            counter++;
        }
    }

    draw2D(): void {
        this.rays.forEach(ray => ray.drawRay2D());
    }

    draw3D(): void {
        let raySliceWidth: number = this.areaState.getCanvas3DWidth() / this.rays.length;
        this.rays.forEach((ray, i) => {
            ray.drawRay3D(raySliceWidth, i);
        })
    }


}