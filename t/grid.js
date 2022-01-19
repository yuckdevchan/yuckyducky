import { Board } from "./board.js";
import { DisplayBox } from "./display_box.js";

export class Grid{
    constructor() {
        this.fillStyle = 'white';
        this.strokeStyle = 'black';
        this.posX = 0;
        this.posY = 0;
        this.inBoard = true;
        this.shrinkFactor = 1;
    }

    static getSize() {
        return 30;
    }

    moveRight() {
        this.idxX += 1;
    }

    moveLeft() {
        this.idxX -= 1;
    }

    moveDown() {
        this.idxY += 1;
    }

    moveUp() {
        this.idxY -= 1;
    }

    render(ctx) {
        let [posX, posY] = Board.getPos(this.idxX, this.idxY)
        if(!this.inBoard) 
            [posX, posY] = [this.posX, this.posY]
        ctx.fillStyle = this.fillStyle;
        ctx.lineWidth = 2 * this.shrinkFactor;
        ctx.fillRect(posX, posY, Grid.getSize() * this.shrinkFactor, Grid.getSize() * this.shrinkFactor);
        ctx.strokeStyle = this.strokeStyle;
        ctx.strokeRect(posX, posY, Grid.getSize() * this.shrinkFactor, Grid.getSize() * this.shrinkFactor);
    }
};