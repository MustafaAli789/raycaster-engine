import { BlockType } from "./BlockType";
import { Map } from "./Map";
import { Player } from "./Player";
import { Ray } from "./Ray";
import { UnitVector } from "./UnitVector";

let canvas: HTMLCanvasElement = document.querySelector('#canvas');
const width = canvas.width;
const height = canvas.height;
const cols = 15;
const rows = 15;

let mapTemplate: BlockType[][] = [
    [BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall,BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall],
]

const map: Map = new Map(rows, cols, width, height, mapTemplate);
const player: Player = new Player(50, 50, new UnitVector(0), map);
const ray: Ray = new Ray(player.getUnitVec(), map);

// window.addEventListener('mousemove', (e) => {
//     var rect = canvas.getBoundingClientRect();
//     console.log(e.clientX - rect.left, e.clientY - rect.top);
// });

function clearCanvas(canvas: HTMLCanvasElement): void {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
}

function main(): void {
    clearCanvas(canvas);
    map.drawMap(canvas);
    player.draw(canvas);
    ray.drawRay(canvas, player.getXMid(), player.getYMid());
}

setInterval(main, 1000/60);