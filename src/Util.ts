import { BlockType } from "./BlockType";
import { Map } from "./Map";
import { MapSizeInfo } from "./MapSizeInfo.interface";
import { Rectangle } from './Rectangle.interface'

interface Point {
    x: number, y: number
}

interface Vector {
    x: number, y: number
}

export class Util {
    constructor(){}

    //algo from the followin resources: 
    //***requires for A B and C to follow one another i.e A is top left, B is top right, C is bottom right
    //https://math.stackexchange.com/questions/2157931/how-to-check-if-a-point-is-inside-a-square-2d-plane
    //https://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not/37865332#37865332
    pointInRectangle(m: Point, r: Rectangle): boolean {
        var AB: Vector = this.vector(r.A, r.B);
        var AM: Vector = this.vector(r.A, m);
        var BC: Vector = this.vector(r.B, r.C);
        var BM: Vector = this.vector(r.B, m);
        var dotABAM: number  = this.dot(AB, AM);
        var dotABAB: number = this.dot(AB, AB);
        var dotBCBM: number = this.dot(BC, BM);
        var dotBCBC: number = this.dot(BC, BC);
        return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
    }
    
    vector(p1: Point, p2: Point): Vector {
        return {
                x: (p2.x - p1.x),
                y: (p2.y - p1.y)
        };
    }

    toRad(deg: number): number {
        return deg*Math.PI/180;
    }

    toDeg(rad: number): number {
        return rad/Math.PI*180;
    }
    
    dot(u: Vector, v: Vector): number {
        return u.x * v.x + u.y * v.y; 
    }

    getMapBlockFromCoord(x: number, y: number, cellWidth: number, cellHeight: number): Point {

        let curXBlockIndex: number = Math.ceil(x/cellWidth)-1;
        let curYBlockIndex: number = Math.ceil(y/cellHeight)-1;

        return {x: curXBlockIndex, y: curYBlockIndex}
    }

    inMapBlock(x: number, y: number, map: Map, cellWidth: number, cellHeight: number): boolean {
        return map.getBlocks()[this.getMapBlockFromCoord(x, y, cellWidth, cellHeight).y][this.getMapBlockFromCoord(x, y, cellWidth, cellHeight).x].getBlockType() === BlockType.Wall;
    }
}