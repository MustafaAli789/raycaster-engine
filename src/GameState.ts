import { AudioControl } from "./AudioControl";
import { Player } from "./Player";
import { UnitVector } from "./UnitVector";
import { Bullet } from "./Bullet";
import { AreaState } from "./AreaState";
import { EnemyNpc } from "./EnemyNpc";

enum ObjectHit {
    Player,
    Wall,
    Ray,
    None
}

export class GameState {
    
    player?: Player;
    enemyNpcs?: EnemyNpc[];
    areaState?: AreaState;

    constructor(areaState: AreaState, movementAudioControl: AudioControl, shootingAudioControl: AudioControl, enemyNpcs?: EnemyNpc[]) {
        this.areaState = this.areaState;
        this.player =  new Player(300, 400, new UnitVector(270), areaState, movementAudioControl, shootingAudioControl);
        if (enemyNpcs) {
            this.enemyNpcs = enemyNpcs;
        }
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

    //Drawing player stuff
    drawPlayer2D(): void {
        this.player.draw2D();
    }
    drawPlayerCrosshair(): void {
        this.player.drawCursor3D();
    }

    //Updating bullets
    updateBullets():void {
        let bullets: Bullet[] = this.player.getBullets().slice(0);

        bullets.forEach((bullet, i) => {
            bullet.moveBullet();
            if (bullet.checkObjectHit() === ObjectHit.Wall) {
                this.player.removeBullets(i);
            }
        });
    }

    //drawing bullets
    drawBullets2D(): void {
        this.player.getBullets().forEach(bullet => bullet.draw2D())
    }

    getAllBullets(): Bullet[] {
        let bullets: Bullet[] = this.player.getBullets().slice(0);
        return bullets;
    }

    getAllEnemies(): EnemyNpc[] {
        return this.enemyNpcs.slice(0);
    }

    //Updating enemy npcs
    updateEnemyNpcs(): void {
        this.enemyNpcs.forEach(enemy => {
            enemy.move();
        })
    }

    drawEnemyNpcs2D(): void {
        this.enemyNpcs.forEach(enemyNpc => enemyNpc.draw2D());
    }

}