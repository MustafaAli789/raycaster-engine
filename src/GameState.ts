import { AudioControl } from "./AudioContro";
import { Player } from "./Player";
import { UnitVector } from "./UnitVector";
import { Bullet } from "./Bullet";
import { AreaState } from "./AreaState";

enum ObjectHit {
    Player,
    Wall,
    Ray,
    None
}

export class GameState {
    
    player?: Player;
    areaState?: AreaState;

    constructor(areaState: AreaState, audioControl: AudioControl) {
        this.areaState = this.areaState;
        this.player =  new Player(300, 350, new UnitVector(270), areaState, audioControl);
    }

    //Player info
    isPlayerMoving(): boolean {
        return this.player.isPlayerMoving();
    }
    isPlayerCrouching(): boolean {
        return this.player.isPlayerCrouching();
    }
    isPlayerRunning(): boolean {
        return this.player.isPlayerRunning();
    }
    getCenterX(): number {
        return this.player.getXMid();
    } 
    getCenterY(): number {
        return this.player.getYMid();
    }
    getCenterDir(): UnitVector {
        let centerDir: UnitVector = this.player.getUnitVec();
        return centerDir;
    }

    drawPlayer2D(): void {
        this.player.draw2D();
    }

    drawPlayerCrosshair(): void {
        this.player.drawCursor3D();
    }


    //Updating and drawing bullets
    updateAndDrawBullets2D():void {
        let bullets: Bullet[] = this.player.getBullets().slice(0);

        bullets.forEach((bullet, i) => {
            bullet.moveBullet();
            if (bullet.checkObjectHit() === ObjectHit.Wall) {
                this.player.removeBullets(i);
            }
        });

        //gonna draw even after collision
        bullets.forEach(bullet => bullet.draw2D())
    }

    getAllBullets(): Bullet[] {
        let bullets: Bullet[] = this.player.getBullets().slice(0);
        return bullets;
    }

}