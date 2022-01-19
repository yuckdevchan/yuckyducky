import { Tetromino } from "./tetromino.js";
import { Grid } from "../grid.js";

export class TetrominoL extends Tetromino{
    constructor() {
        super();
        let posPair = [[0, 1], [1, 1], [2, 0], [2, 1]]
        for (let i = 0; i < this.numGrids; i++) {
            let grid = new Grid();
            grid.fillStyle = 'orange';
            [grid.idxX, grid.idxY]  = posPair[i];
            this.grids.push(grid);
        }
        this.offsetX = 3;
        this.rotationOffsets = [[0, 0], [0, 0], [0, 0], [0, 0]];
        this.axisGrid = this.grids[1];
        this.name = "tetromino_l";
    }
}