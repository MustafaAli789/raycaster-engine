import { AudioControl } from "./AudioControl";
import { Player } from "./Player";
import { UnitVector } from "./UnitVector";
import { Bullet } from "./Bullet";
import { AreaState } from "./AreaState";
import { EnemyNpc } from "./EnemyNpc";
import { Util } from "./Util";

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
    util: Util = new Util();

    totNumEnemiesInWave: number = 1;
    numEnemiesRemaining: number = 1;

    constructor(areaState: AreaState, movementAudioControl: AudioControl, shootingAudioControl: AudioControl) {
        this.areaState = areaState;
        this.player =  new Player(300, 400, new UnitVector(270), areaState, movementAudioControl, shootingAudioControl);
        this.enemyNpcs = [new EnemyNpc(300, 350, new UnitVector(45), areaState)];
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

    //Updating bullets position
    //bullet only responsible for its own collision with wall
    updateBullets():void {
        let bullets: Bullet[] = this.player.getBullets().slice(0);

        bullets.forEach((bullet, i) => {
            bullet.moveBullet();
            if (bullet.checkWallHit()) {
                this.player.removeBullets(i);
            }
        });
    }

    //drawing bullets
    drawBullets2D(): void {
        this.player.getBullets().forEach(bullet => bullet.draw2D())
    }

    //Updating enemy npcs position
    //enemy only responsible for its own collision with wall
    updateEnemyNpcs(): void {
        this.enemyNpcs.forEach(enemy => {
            enemy.move();
        })
    }

    drawEnemyNpcs2D(): void {
        this.enemyNpcs.forEach(enemyNpc => enemyNpc.draw2D());
    }


    //Entity getters
    getAllBullets(): Bullet[] {
        let bullets: Bullet[] = this.player.getBullets().slice(0);
        return bullets;
    }
    getAllEnemies(): EnemyNpc[] {
        return this.enemyNpcs.slice(0);
    }

    //EXTERNAL COLLISIONS (b/w enemy and player and bullet and enemy)
    checkExternalCollisions(): void {
        //checking enemy with player collision
        this.enemyNpcs.forEach(enemy => {
            let distFromEnemyCenterToPlayerCenter: number = this.util.dist({x: enemy.getX(), y: enemy.getY()}, {x: this.player.getXMid(), y:this.player.getYMid()});
            if (distFromEnemyCenterToPlayerCenter < enemy.getDim() + 0) { //the + 0 should really be the dim of the player but for now the player is just a point
                this.player.reset();
            }
        })

        let bullets: Bullet[] = this.getAllBullets();
        for (let i = this.enemyNpcs.length-1; i>=0; i--) {
            let enemy: EnemyNpc = this.enemyNpcs[i];
            for (let j = 0; j<bullets.length; j++) {
                let bullet: Bullet = bullets[j];
                let distFromEnemyCenterToBulletCenter: number = this.util.dist({x: enemy.getX(), y: enemy.getY()}, {x: bullet.getX(), y:bullet.getY()});
                if (distFromEnemyCenterToBulletCenter < (enemy.getDim() + bullet.getDim())) { 
                    this.enemyNpcs.splice(i, 1);
                    this.player.removeBullets(j);
                    this.numEnemiesRemaining--;
                    break;
                }
            }
        }

        //new wave
        if (this.numEnemiesRemaining === 0) {
            this.totNumEnemiesInWave++;
            this.numEnemiesRemaining = this.totNumEnemiesInWave;
            for (let i = 0; i<this.totNumEnemiesInWave; i++) {
                this.enemyNpcs.push(new EnemyNpc(300, 350, new UnitVector(Math.random()*360), this.areaState));
            }
        }
    }

}