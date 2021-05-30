import {BlockType} from './BlockType'
export class Block {
    blockType?: BlockType;
    row?: number;
    col?: number;
    constructor(blockType: BlockType, row: number, col: number) {
        this.row = row;
        this.col = col;
        this.blockType = blockType;
    }

    getBlockType(): BlockType {
        return this.blockType;
    }

    getRow(): number {
        return this.row;
    }

    getCol(): number {
        return this.col;
    }
}