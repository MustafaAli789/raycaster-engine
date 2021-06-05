import { AudioControl } from "./AudioContro";
import { BlockType } from "./BlockType";
import { Map } from "./Map";
import { Player } from "./Player";
import { Rays } from "./Rays";
import { UnitVector } from "./UnitVector";

let canvas2D: HTMLCanvasElement = document.querySelector('#canvasLeft');
let canvas3D: HTMLCanvasElement = document.querySelector('#canvasRight');

//https://www.youtube.com/watch?v=dnRX_bHbYgs got audio from here
//audio initial values
let audioControl: AudioControl = new AudioControl('audio');

const widthCanvas2D = canvas2D.width;
const heightCanvas2D = canvas2D.height;
const widthCanvas3D = canvas3D.width;
const heightCanvas3D = canvas3D.height;
const cols = 15;
const rows = 15;

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

const map: Map = new Map(rows, cols, widthCanvas2D, heightCanvas2D, mapTemplate, canvas2D);
const player: Player = new Player(300, 350, new UnitVector(270), map, canvas3D, canvas2D, audioControl);
const rays: Rays = new Rays(map, canvas2D, canvas3D);

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
    map.drawMap();
    player.draw2D();
    rays.setData(player.getXMid(), player.getYMid(), player.getUnitVec(), player.isPlayerMoving(), player.isPlayerCrouching());
    rays.draw2D();
    rays.draw3D();
}

setInterval(main, 1000/60);