import { AreaState } from "./AreaState";
import { AudioControl } from "./AudioControl";
import { BlockType } from "./Model/EBlockType";
import { GameState } from "./GameState";
import { Map } from "./Map";
import { Player } from "./Player";
import { Rays } from "./Rays";
import { UnitVector } from "./UnitVector";
import { EnemyNpc } from "./EnemyNpc";

let canvas2D: HTMLCanvasElement = document.querySelector('#canvasLeft');
let canvas3D: HTMLCanvasElement = document.querySelector('#canvasRight');

//https://www.youtube.com/watch?v=dnRX_bHbYgs got audio from here
//audio initial values
let movementAudioControl: AudioControl = new AudioControl('movementAudioElem');
let shootingAudioControl: AudioControl = new AudioControl('shootingAudioElem', 1, false, 1);

let mapTemplate: BlockType[][] = [
    [BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall,BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall],
]
const enemyNpcs: EnemyNpc[] = [new EnemyNpc(300, 350, new UnitVector(270))]
const AState: AreaState = new AreaState(canvas2D, canvas3D, mapTemplate);
const GState: GameState = new GameState(AState, movementAudioControl, shootingAudioControl, enemyNpcs);
const rays: Rays = new Rays(GState, AState);

// window.addEventListener('mousemove', (e) => {
//     var rect = canvas.getBoundingClientRect();
//     console.log(e.clientX - rect.left, e.clientY - rect.top);
// });

function clearCanvas(canvas: HTMLCanvasElement): void {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function main(): void {
    clearCanvas(canvas2D);
    clearCanvas(canvas3D);
    AState.drawMap();
    GState.drawPlayer2D();
    rays.setupRays();
    rays.draw2D();
    GState.updateAndDrawBullets2D();
    //GState.drawBullets();
    rays.draw3D();
    GState.drawPlayerCrosshair();
}

setInterval(main, 1000/60);
