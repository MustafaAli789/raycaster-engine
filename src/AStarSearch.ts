import { AreaState } from "./AreaState";
import { createBinaryHeap, BinaryHeap } from "ts-bin-heap";
import { BlockType } from "./Model/EBlockType";

interface Position {
    row: number,
    col: number
}

interface Point {
    x: number,
    y: number
}

interface Node {
    id: string,
    position: Position,
    g_score: number,
    h_score: number,
    f_score: number,
    parent_Node?: Node
}

interface NodeNeighbour {
    node: Node,
    d_val: number //i.e dist b/w parent and this neighbour
}

export class AStarSearch {

    areaState?: AreaState;
    path: Node[] = [];
    nodes: Node[][] = [];
    cellStraightDist: number = 1; //dist b/w adjacent cells in top right bottom or left


    constructor(areaState: AreaState) {
        this.areaState = areaState;

        //init nodes
        this.areaState.getMap().getBlocks().forEach((row, iRow) => {
            let nodeRow: Node[] = new Array<Node>();
            row.forEach((block, iCol) => {
                if (block.getBlockType() == BlockType.Wall) {
                    nodeRow.push(null);
                } else if (block.getBlockType() == BlockType.Empty) {
                    let position: Position = {col: iCol, row: iRow}
                    let h_score: number = null;
                    let g_score: number = 999999;
                    nodeRow.push({id: JSON.stringify(position),position: position, h_score: h_score, g_score: g_score, f_score: 999999});
                }
            });
            this.nodes.push(nodeRow);
        });
    }

    private getXYFromRowCol(position: Position): Point {
        //the lil /2 part is to get center of cell
        return {x: position.col*this.areaState.getCellWidth()+this.areaState.getCellWidth()/2, y:position.row*this.areaState.getCellHeight()+this.areaState.getCellHeight()/2}
    }

    //had to remove daigonal neighbours to prevent diagonal traversion b/c
    //it was causing enemies to clip walls as they moved from one block to another.
    //essentially, i take the path returned by this class and move the enemy to the second ndoe in the path since the first is just the cur node the enemy is in
    //if the second node is a diagonal node, it might clip a wall along the way 
    //only way to prevent this is to force enemy to have to visit the center of their cur block first before going to second but its too difficult so i wont bother
    private getNodeNeighbours(curNode: Node, endNode: Node): NodeNeighbour[] {
        let neighBours: NodeNeighbour[] = [];
        let endNodePoint: Point = this.getXYFromRowCol(endNode.position);

        //topleft
        // if (curNode.position.col > 0 && curNode.position.row > 0 && this.nodes[curNode.position.row-1][curNode.position.col-1] != null) {
        //     let node: Node = this.nodes[curNode.position.row-1][curNode.position.col-1]

        //     if (node.h_score === null) {
        //         let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
        //         node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
        //     }

        //     let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist+this.cellStraightDist)}
        //     neighBours.push(neighBour);
        // }

        //top
        if (curNode.position.row > 0 && this.nodes[curNode.position.row-1][curNode.position.col] != null) {
            let node: Node = this.nodes[curNode.position.row-1][curNode.position.col]
            
            if (node.h_score === null) {
                let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
                node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
            }

            let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist)}
            neighBours.push(neighBour);
        }

        //topright
        // if (curNode.position.col < this.nodes[0].length-1 && curNode.position.row > 0 && this.nodes[curNode.position.row-1][curNode.position.col+1] != null) {
        //     let node: Node = this.nodes[curNode.position.row-1][curNode.position.col+1]

        //     if (node.h_score === null) {
        //         let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
        //         node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
        //     }

        //     let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist+this.cellStraightDist)}
        //     neighBours.push(neighBour);
        // }

        //left
        if (curNode.position.col > 0 && this.nodes[curNode.position.row][curNode.position.col-1] != null) {
            let node: Node = this.nodes[curNode.position.row][curNode.position.col-1]

            if (node.h_score === null) {
                let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
                node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
            }

            let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist)}
            neighBours.push(neighBour);
        }

        //right
        if (curNode.position.col < this.nodes[0].length-1 && this.nodes[curNode.position.row][curNode.position.col+1] != null) {
            let node: Node = this.nodes[curNode.position.row][curNode.position.col+1]

            if (node.h_score === null) {
                let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
                node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
            }

            let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist)}
            neighBours.push(neighBour);
        }

        //bottomleft
        // if (curNode.position.col > 0 && curNode.position.row < this.nodes.length-1 && this.nodes[curNode.position.row+1][curNode.position.col-1] != null) {
        //     let node: Node = this.nodes[curNode.position.row+1][curNode.position.col-1]

        //     if (node.h_score === null) {
        //         let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
        //         node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
        //     }

        //     let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist+this.cellStraightDist)}
        //     neighBours.push(neighBour);
        // }

        //bottom
        if (curNode.position.row < this.nodes.length-1 && this.nodes[curNode.position.row+1][curNode.position.col] != null) {
            let node: Node = this.nodes[curNode.position.row+1][curNode.position.col]

            if (node.h_score === null) {
                let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
                node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
            }

            let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist)}
            neighBours.push(neighBour);
        }

        //bottomright
        // if (curNode.position.col < this.nodes[0].length-1 && curNode.position.row < this.nodes.length-1 && this.nodes[curNode.position.row+1][curNode.position.col+1] != null) {
        //     let node: Node = this.nodes[curNode.position.row+1][curNode.position.col+1]

        //     if (node.h_score === null) {
        //         let curNodePoint: Point = this.getXYFromRowCol(curNode.position);
        //         node.h_score = Math.sqrt((endNodePoint.x - curNodePoint.x)**2+(endNodePoint.y-curNodePoint.y)**2)
        //     }

        //     let neighBour: NodeNeighbour = {node: node, d_val: Math.sqrt(this.cellStraightDist+this.cellStraightDist)}
        //     neighBours.push(neighBour);
        // }

        return neighBours;
    }

    private reconstructPath(endNode: Node): void {
        let current: Node = endNode;
        this.path.unshift(current);
        while(current.parent_Node != undefined) { //start nodes parent is undef so shuld stop there
            console.log(current)
            current = current.parent_Node;
            this.path.unshift(current);
        }
    }
    
    resetSearcher(): void {
        this.path = [];
        this.nodes.forEach(nodeRow => {
            nodeRow.forEach(node => {
                if (node != null) {
                    node.g_score = 999999;
                    node.h_score = null;
                    node.f_score = 999999;  
                    node.parent_Node = undefined;
                }
                
            })
        })
    }

    calculatePath(startRow: number, startCol: number, endRow: number, endCol: number): Node[] {

        const startNode: Node = this.nodes[startRow][startCol];
        startNode.g_score = 0;

        const endNode: Node = this.nodes[endRow][endCol];
        endNode.h_score = 0;

        const openSet: BinaryHeap<Node> = createBinaryHeap<Node>(node => node.f_score);
        openSet.push(startNode);
        let nodesInOpenSet: any = {'start': true};

        let current: Node;

        while(openSet.length > 0) {
            current = openSet.pop();
            nodesInOpenSet[current.id] = false;

            if (current === endNode) {
                this.reconstructPath(endNode);
                return this.path;
            }

            this.getNodeNeighbours(current, endNode).forEach(neighbour => {
                let tentative_gScore: number = current.g_score+neighbour.d_val;
                if (tentative_gScore < neighbour.node.g_score) { 
                    neighbour.node.parent_Node = current;
                    neighbour.node.g_score = tentative_gScore;
                    neighbour.node.f_score = neighbour.node.g_score+neighbour.node.h_score;

                    if (!nodesInOpenSet[neighbour.node.id]) { //true means in open set
                        openSet.push(neighbour.node);
                        nodesInOpenSet[neighbour.node.id] = true;
                    }
                }
            })
        }

        return null;
    }
} 