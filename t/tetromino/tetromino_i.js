import { Tetromino } from "./tetromino.js";
import { Grid } from "../grid.js";

export class TetrominoI extends Tetromino{
    constructor() {
        super();
        let posPair = [[0, 0], [1, 0], [2, 0], [3, 0]]
        for (let i = 0; i < this.numGrids; i++) {
            let grid = new Grid();
            grid.fillStyle = 'cyan';
            [grid.idxX, grid.idxY]  = posPair[i];
            this.grids.push(grid);
        }
        this.offsetX = 3;
        this.rotationOffsets = [[0, 1], [-1, 0], [0, -1], [1, 0]];
        this.axisGrid = this.grids[2];
        this.name = "tetromino_i";
    }
}