import { Tetromino } from "./tetromino.js";
import { Grid } from "../grid.js";

export class TetrominoR extends Tetromino{
    constructor() {
        super();
        let posPair = [[2, 1], [1, 1], [0, 0], [0, 1]]
        for (let i = 0; i < this.numGrids; i++) {
            let grid = new Grid();
            grid.fillStyle = 'rgb(40, 40, 255)';
            [grid.idxX, grid.idxY]  = posPair[i];
            this.grids.push(grid);
        }
        this.offsetX = 3;
        this.rotationOffsets = [[0, 0], [0, 0], [0, 0], [0, 0]];
        this.axisGrid = this.grids[1];
        this.name = "tetromino_r";
    }
}