import { BlockType } from "./BlockType";
import { Map } from "./Map";

let canvas: HTMLCanvasElement = document.querySelector('#canvas');
const width = canvas.width;
const height = canvas.height;
const cols = 15;
const rows = 15;

let mapTemplate: BlockType[][] = [
    [BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall,BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Empty, BlockType.Wall],
    [BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall, BlockType.Wall],
]

const map: Map = new Map(rows, cols, width, height, mapTemplate);

function main(): void {
    map.drawMap(canvas);
}

setInterval(main, 1000/60);