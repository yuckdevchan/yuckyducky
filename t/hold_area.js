import { Input } from "./input.js";
import { Board } from "./board.js";
import { Grid } from "./grid.js";
import { DisplayBox } from "./display_box.js";
import { TetrominoFactory } from "./tetromino/tetromino_factory.js";

export class HoldArea {
	constructor() {
		let posCenterX = window.innerWidth / 2;
		let posCenterY = window.innerHeight / 2;
		this.posX = posCenterX - (Board.getNumGridX() * Grid.getSize()) / 2 - 100;
		this.posY = posCenterY - 200;

		this.holdTetromino = null;
		this.displayBox = new DisplayBox(this.posX, this.posY);
	}

	reset() {
		this.holdTetromino = null;
	}

	update(movingTetromino) {
		if (Input.holdAvailable && Input.events.c) {
			Input.events.c = false;
			Input.holdAvailable = false;

			let movingTetrominoName = movingTetromino.name;

			if (this.holdTetromino) {
				let holdTetrominoName = this.holdTetromino.name;
				movingTetromino = TetrominoFactory.createFromName(holdTetrominoName);
				movingTetromino.setInBoard();
			} else {
				movingTetromino = null;
			}
			this.holdTetromino = TetrominoFactory.createFromName(movingTetrominoName);
			this.holdTetromino.setNotInBoard(this.posX, this.posY);
		}
		return movingTetromino;
	}

	render(ctx) {
		this.displayBox.render(ctx);
		if (this.holdTetromino) this.holdTetromino.render(ctx);
	}
}
