import { AudioControl } from "./AudioContro";
import { BlockType } from "./BlockType";
import { Player } from "./Player";
import { Map } from "./Map";
import { UnitVector } from "./UnitVector";
import {MapSizeInfo} from './MapSizeInfo.interface'
import { Block } from "./Block";
import { Bullet } from "./Bullet";

enum ObjectHit {
    Player,
    Wall,
    Ray,
    None
}

export class GameState {
    
    player?: Player;
    canvas2D?: HTMLCanvasElement;
    map?: Map;

    mapSizeInfo?: MapSizeInfo;

    constructor(canvas2D: HTMLCanvasElement, mapTemplate: BlockType[][], audioControl: AudioControl) {
        this.mapSizeInfo = {rows: mapTemplate.length, 
                            cols: mapTemplate[0].length, 
                            cellWidth: canvas2D.width/mapTemplate[0].length,
                            cellHeight: canvas2D.height/mapTemplate.length}
        this.map = new Map(this.mapSizeInfo, mapTemplate, canvas2D);
        this.player =  new Player(300, 350, new UnitVector(270), this.map, canvas2D, audioControl, this.mapSizeInfo);
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

    //Map info
    getMapSizeInfo(): MapSizeInfo {
        return this.mapSizeInfo;
    }
    getMapBlocks(): Block[][] {
        return this.map.blocks;
    }

    //Drawing
    drawMap(): void {
        this.map.drawMap();
    }
    drawPlayer(): void {
        this.player.draw2D();
    }

    //Updating and drawing bullets
    updateAndDrawBullets():void {
        let bullets: Bullet[] = this.player.getBullets().slice(0);

        bullets.forEach((bullet, i) => {
            bullet.moveBullet();
            if (bullet.checkObjectHit(this.map) === ObjectHit.Wall) {
                this.player.removeBullets(i);
            }
        });

        //gonna draw even after collision
        bullets.forEach(bullet => bullet.draw2D())
    }

    // drawBullets(): void {
    //     this.player.getBullets().forEach(bullet => bullet.draw2D())
    // }


}