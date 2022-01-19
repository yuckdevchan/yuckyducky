import { Input } from "./input.js";
import { Board } from "./board.js";
import { Grid } from "./grid.js";
import { DisplayBox } from "./display_box.js";
import { TetrominoFactory } from "./tetromino/tetromino_factory.js";

export class NextArea {
	constructor() {
		let posCenterX = window.innerWidth / 2;
		let posCenterY = window.innerHeight / 2;
		this.posX = posCenterX + (Board.getNumGridX() * Grid.getSize()) / 2 + 100;
		this.posStartY = posCenterY - 200;
		this.nextTetrominos = [];
		this.nextTetrominoBoxes = [];
		this.numNextTetromino = 3;
		for (let i = 0; i < this.numNextTetromino; i++) {
			let [posX, posY] = [this.posX, this.posStartY + i * DisplayBox.getHeight()];
			this.nextTetrominoBoxes.push(new DisplayBox(posX, posY));
		}
	}

	reset() {
		this.nextTetrominos = [];
	}

	intialize() {
		for (let i = 0; i < this.numNextTetromino; i++) {
			let tetromino = TetrominoFactory.randomCreate();
			let [posX, posY] = [this.posX, this.posStartY + i * DisplayBox.getHeight()];
			tetromino.setNotInBoard(posX, posY);
			this.nextTetrominos.push(tetromino);
		}
	}

	getNextTetromino() {
		let newTetromino = TetrominoFactory.randomCreate();
		let nextTetromino = this.nextTetrominos[0];
		this.nextTetrominos.splice(0, 1);
		this.nextTetrominos.push(newTetromino);
		return nextTetromino;
	}

	arrangePosition() {
		let i = 0;
		for (let tetromino of this.nextTetrominos) {
			let [posX, posY] = [this.posX, this.posStartY + i * DisplayBox.getHeight()];
			tetromino.setNotInBoard(posX, posY);
			i++;
		}
	}

	update() {
		this.arrangePosition();
	}

	render(ctx) {
		for (let displayBox of this.nextTetrominoBoxes) displayBox.render(ctx);
		for (let tetromino of this.nextTetrominos) tetromino.render(ctx);
	}
}
