import { Block } from './Block'
import { BlockType } from './BlockType';
import {MapSizeInfo} from './MapSizeInfo.interface'

export class Map {
    mapSizeInfo?: MapSizeInfo;
    blocks?: Block[][];
    canvas?: HTMLCanvasElement;

    constructor(mapSizeInfo: MapSizeInfo, mapTemplate: Array<Array<BlockType>>, canvas: HTMLCanvasElement) {
        this.blocks = new Array<Array<Block>>();
        this.canvas = canvas;
        this.mapSizeInfo = mapSizeInfo;

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
                    context.rect(this.mapSizeInfo.cellWidth*iCol, this.mapSizeInfo.cellHeight*iRow, this.mapSizeInfo.cellWidth, this.mapSizeInfo.cellHeight);
                    context.stroke();
                }
            });
        });
    }

    getBlocks(): Block[][] {
        return this.blocks;
    }
}