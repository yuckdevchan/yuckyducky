import { Input } from "../input.js";
import { Board } from "../board.js";
import { Grid } from "../grid.js";
import { AudioPlayer } from "../audio_player.js";

export class Tetromino {
	constructor() {
		this.numGrids = 4;
		this.grids = []; // 4 grids compose a tetromino
		this.axisGrid;
		this.movable = true;
		this.rotationPhase = 0;
		this.rotationOffsets = [];
		this.shadows = [];
		this.shrinkFactor = 0.7;
		this.inBoard = true;
	}

	update(timer) {
		if (timer) {
			if (this.movable) {
				if (!this.canMoveDown()) {
					this.movable = false;
                    AudioPlayer.playStrikeAudio();
				} else {
					this.moveDown();
				}
			}
		}
		if (this.movable) {
			if (this.canMoveRight() && Input.moveAvailable && Input.events.right) {
				this.moveRight();
				Input.moveAvailable = false;
				setTimeout(() => {
					Input.moveAvailable = true;
				}, 70);
			}
			if (this.canMoveDown() && Input.moveAvailable && Input.events.down) {
				this.moveDown();
				Input.moveAvailable = false;
				setTimeout(() => {
					Input.moveAvailable = true;
				}, 70);
			}
			if (this.canMoveLeft() && Input.moveAvailable && Input.events.left) {
				this.moveLeft();
				Input.moveAvailable = false;
				setTimeout(() => {
					Input.moveAvailable = true;
				}, 70);
			}
			if (Input.rotationAvailable && Input.events.up) {
				Input.events.up = false;
				this.tryRotateRight();
				Input.rotationAvailable = false;
				setTimeout(() => {
					Input.rotationAvailable = true;
				}, 100);
			}
			if (Input.strikeAvailable && Input.events.space) {
				this.moveStrikeDown();
				Input.events.space = false;
				this.updateMovable();
				Input.strikeAvailable = false;
				setTimeout(() => {
					Input.strikeAvailable = true;
				}, 70);
				AudioPlayer.playStrikeAudio();
			}
		}

		this.updateShadow();
	}

	updateMovable() {
		this.movable = this.canMoveDown();
	}

	updateShadow() {
		this.shadows = [];
		if (this.movable) {
			for (let grid of this.grids) {
				let shadow = new Grid();
				[shadow.idxX, shadow.idxY] = [grid.idxX, grid.idxY];
				shadow.fillStyle = "rgb(60, 60, 60)";
				this.shadows.push(shadow);
			}
			while (this.shadowCanMoveDown()) {
				this.shadowMoveDown();
			}
		}
	}

	shadowCanMoveDown() {
		for (let grid of this.shadows) {
			let idxY = grid.idxY + 1;
			if (!Board.isGridValid(grid.idxX, idxY)) return false;
		}
		return true;
	}

	shadowMoveDown() {
		for (let grid of this.shadows) {
			grid.moveDown();
		}
	}

	canMoveRight() {
		for (let grid of this.grids) {
			let idxX = grid.idxX + 1;
			if (!Board.isGridValid(idxX, grid.idxY)) return false;
		}
		return true;
	}

	canMoveLeft() {
		for (let grid of this.grids) {
			let idxX = grid.idxX - 1;
			if (!Board.isGridValid(idxX, grid.idxY)) return false;
		}
		return true;
	}

	canMoveDown() {
		for (let grid of this.grids) {
			let idxY = grid.idxY + 1;
			if (!Board.isGridValid(grid.idxX, idxY)) return false;
		}
		return true;
	}

	moveRight() {
		for (let grid of this.grids) {
			grid.moveRight();
		}
	}

	moveLeft() {
		for (let grid of this.grids) {
			grid.moveLeft();
		}
	}

	moveUp() {
		for (let grid of this.grids) {
			grid.moveUp();
		}
	}

	moveDown() {
		for (let grid of this.grids) {
			grid.moveDown();
		}
	}

	moveStrikeDown() {
		while (this.canMoveDown()) {
			this.moveDown();
		}
	}

	tryRotateRight() {
		let rotated = false;

		if (this.canRotateRight()) {
			this.rotateRight();
			rotated = true;
		} else {
			if (!rotated) {
				this.moveRight();
				if (this.canRotateRight()) {
					this.rotateRight();
					rotated = true;
				} else {
					this.moveLeft();
				}
			}
			if (!rotated) {
				this.moveLeft();
				if (this.canRotateRight()) {
					this.rotateRight();
					rotated = true;
				} else {
					this.moveRight();
				}
			}
			if (!rotated) {
				this.moveDown();
				if (this.canRotateRight()) {
					this.rotateRight();
					rotated = true;
				} else {
					this.moveUp();
				}
			}
			if (!rotated) {
				this.moveUp();
				if (this.canRotateRight()) {
					this.rotateRight();
					rotated = true;
				} else {
					this.moveDown();
				}
			}
		}
		return rotated;
	}

	canRotateLeft() {
		let [axisIdxX, axisIdxY] = [this.axisGrid.idxX, this.axisGrid.idxY];
		let [rotationOffsetX, rotationOffsetY] = this.rotationOffsets[this.rotationPhase];
		for (let grid of this.grids) {
			let disX = grid.idxX - axisIdxX;
			let disY = grid.idxY - axisIdxY;
			let idxX = axisIdxX + disY + rotationOffsetX;
			let idxY = axisIdxY - disX + rotationOffsetY;
			if (!Board.isGridValid(idxX, idxY)) return false;
		}
		return true;
	}

	canRotateRight() {
		let [axisIdxX, axisIdxY] = [this.axisGrid.idxX, this.axisGrid.idxY];
		let [rotationOffsetX, rotationOffsetY] = this.rotationOffsets[this.rotationPhase];
		for (let grid of this.grids) {
			let disX = grid.idxX - axisIdxX;
			let disY = grid.idxY - axisIdxY;
			let idxX = axisIdxX - disY + rotationOffsetX;
			let idxY = axisIdxY + disX + rotationOffsetY;
			if (!Board.isGridValid(idxX, idxY)) return false;
		}
		return true;
	}

	rotateRight() {
		let [axisIdxX, axisIdxY] = [this.axisGrid.idxX, this.axisGrid.idxY];
		let [rotationOffsetX, rotationOffsetY] = this.rotationOffsets[this.rotationPhase];
		for (let grid of this.grids) {
			let disX = grid.idxX - axisIdxX;
			let disY = grid.idxY - axisIdxY;
			grid.idxX = axisIdxX - disY + rotationOffsetX;
			grid.idxY = axisIdxY + disX + rotationOffsetY;
		}
		this.rotationPhase++;
		this.rotationPhase %= 4;
	}

	rotateLeft() {
		let [axisIdxX, axisIdxY] = [this.axisGrid.idxX, this.axisGrid.idxY];
		let [rotationOffsetX, rotationOffsetY] = this.rotationOffsets[this.rotationPhase];
		for (let grid of this.grids) {
			let disX = grid.idxX - axisIdxX;
			let disY = grid.idxY - axisIdxY;
			grid.idxX = axisIdxX + disY + rotationOffsetX;
			grid.idxY = axisIdxY - disX + rotationOffsetY;
		}
		this.rotationPhase++;
		this.rotationPhase %= 4;
	}

	setInBoard() {
		this.inBoard = true;
		for (let grid of this.grids) {
			grid.shrinkFactor = 1;
			grid.idxX += this.offsetX;
			grid.inBoard = true;
		}
	}

	setNotInBoard(posCenterX, posCenterY) {
		this.inBoard = false;
		let [idxRight, idxLeft, idxTop, idxBottom] = [-100, 100, 100, -100];
		for (let grid of this.grids) {
			idxRight = Math.max(grid.idxX, idxRight);
			idxLeft = Math.min(grid.idxX, idxLeft);
			idxTop = Math.min(grid.idxY, idxTop);
			idxBottom = Math.max(grid.idxY, idxBottom);
		}
		let [disHoriz, disVert] = [idxRight - idxLeft + 1, idxBottom - idxTop + 1];
		let posStartX = posCenterX - (disHoriz / 2) * Grid.getSize() * this.shrinkFactor;
		let posStartY = posCenterY - (disVert / 2) * Grid.getSize() * this.shrinkFactor;
		for (let grid of this.grids) {
			grid.posX = posStartX + grid.idxX * Grid.getSize() * this.shrinkFactor;
			grid.posY = posStartY + grid.idxY * Grid.getSize() * this.shrinkFactor;
			grid.shrinkFactor = this.shrinkFactor;
			grid.inBoard = false;
		}
	}

	checkGameOver() {
		for (let grid of this.grids) {
			if (!Board.isGridValid(grid.idxX, grid.idxY)) return true;
		}
		return false;
	}

	render(ctx) {
		if (this.inBoard) {
			for (let grid of this.shadows) {
				grid.render(ctx);
			}
		}

		for (let grid of this.grids) {
			grid.render(ctx);
		}
	}
}
