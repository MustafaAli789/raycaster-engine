import { Block } from './Block'
import { BlockType } from './BlockType';
export class Map {
    rows?: number;
    cols?: number;
    width?: number;
    height?: number;
    blocks?: Block[][];
    cellWidth?: number;
    cellHeight?: number;

    constructor(rows: number, cols: number, width: number, height: number, mapTemplate?: Array<Array<BlockType>>) {
        this.rows = rows;
        this.cols = cols;
        this.height = height;
        this.width = width;
        this.cellHeight = height/rows; //need to be evenly div
        this.cellWidth = width/cols;
        this.blocks = new Array<Array<Block>>();

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

    drawMap(canvas: HTMLCanvasElement): void {
        if (canvas.height !== this.height) {
            throw console.error('Canvas height did not match map height');  
        }
        if (canvas.width !== this.width) {
            throw console.error('Canvas width did not match map width');  
        }
        let context = canvas.getContext('2d');
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

    getHeight(): number {
        return this.height;
    }

    getWidth(): number {
        return this.width;
    }

    getCols(): number {
        return this.cols;
    }

    getRows(): number {
        return this.rows;
    }

}