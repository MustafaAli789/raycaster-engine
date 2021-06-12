interface Point {
    x: number, y: number
}

interface Rectangle {
    A: {x: number, y: number},
    B: {x: number, y: number},
    C: {x: number, y: number},
    D: {x: number, y: number},
}

interface Vector {
    x: number, y: number
}

export class Util {
    constructor(){}

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
    
    vector(p1, p2): Vector {
        return {
                x: (p2.x - p1.x),
                y: (p2.y - p1.y)
        };
    }
    
    dot(u, v): number {
        return u.x * v.x + u.y * v.y; 
    }
}