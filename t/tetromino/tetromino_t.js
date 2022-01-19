import { Tetromino } from "./tetromino.js";
import { Grid } from "../grid.js";

export class TetrominoT extends Tetromino{
    constructor() {
        super();
        let posPair = [[0, 1], [1, 0], [1, 1], [2, 1]];
        for (let i = 0; i < this.numGrids; i++) {
            let grid = new Grid();
            grid.fillStyle = 'rgb(170, 0, 170)';
            [grid.idxX, grid.idxY]  = posPair[i];
            this.grids.push(grid);
        }
        this.offsetX = 3;
        this.rotationOffsets = [[0, 0], [0, 0], [0, 0], [0, 0]];
        this.axisGrid = this.grids[2];
        this.name = "tetromino_t";
    }
}