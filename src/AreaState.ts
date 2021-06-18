import { BlockType } from "./Model/EBlockType";
import { Map } from "./Map";

export class AreaState {
    canvas2D?: HTMLCanvasElement;
    canvas3D?: HTMLCanvasElement;
    map?: Map;

    cellWidth?: number;
    cellHeight?: number;

    constructor(canvas2D: HTMLCanvasElement, canvas3D: HTMLCanvasElement, mapTemplate: BlockType[][]) {
        this.canvas3D = canvas3D;
        this.canvas2D = canvas2D;

        this.cellWidth = canvas2D.width/mapTemplate[0].length;
        this.cellHeight = canvas2D.height/mapTemplate.length;

        this.map = new Map(this.cellWidth, this.cellHeight, mapTemplate, canvas2D);
    }

    getCanvas2DHeight(): number {
        return this.canvas2D.height;
    }
    geCanvast3DHeight(): number {
        return this.canvas3D.height;
    }
    getCanvas2DWidth(): number {
        return this.canvas2D.width;
    }
    getCanvas3DWidth(): number {
        return this.canvas3D.width;
    }

    getCanvas2D(): HTMLCanvasElement {
        return this.canvas2D;
    }
    getCanvas3D(): HTMLCanvasElement {
        return this.canvas3D;
    }

    getCellWidth(): number {
        return this.cellWidth;
    }   
    getCellHeight(): number {
        return this.cellHeight;
    }

    getMap(): Map {
        return this.map;
    }

    drawMap(): void {
        this.map.drawMap();
    }

}