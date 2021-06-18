import { Block } from './Block'
import { BlockType } from './Model/EBlockType';

export class Map {
    cellWidth?: number;
    cellHeight?: number;
    blocks?: Block[][];
    canvas?: HTMLCanvasElement;

    constructor(cellWidth: number, cellHeight: number, mapTemplate: Array<Array<BlockType>>, canvas: HTMLCanvasElement) {
        this.blocks = new Array<Array<Block>>();
        this.canvas = canvas;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        if(mapTemplate) {
            mapTemplate.forEach((row, iRow) => {
                let r: Block[] = new Array<Block>();
                row.forEach((bType, iCol) => {
                    r.push(new Block(bType, iRow, iCol));
                });
                this.blocks.push(r);
            });
        }
    }

    drawMap(): void {
        let context = this.canvas.getContext('2d');
        this.blocks.forEach((row, iRow) => {
            row.forEach((block, iCol) => {
                if (block.blockType === BlockType.Wall) {
                    context.beginPath();
                    context.rect(this.cellWidth*iCol, this.cellHeight*iRow, this.cellWidth, this.cellHeight);
                    context.stroke();
                }
            });
        });
    }

    getBlocks(): Block[][] {
        return this.blocks;
    }
}