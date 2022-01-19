import { TetrominoS } from "./tetromino_s.js";
import { TetrominoN } from "./tetromino_n.js";
import { TetrominoT } from "./tetromino_t.js";
import { TetrominoI } from "./tetromino_i.js";
import { TetrominoO } from "./tetromino_o.js";
import { TetrominoL } from "./tetromino_l.js";
import { TetrominoR } from "./tetromino_r.js";

export class TetrominoFactory {
    static tetrominos = [
        TetrominoS,
        TetrominoN,
        TetrominoL,
        TetrominoR,
        TetrominoT,
        TetrominoO,
        TetrominoI,
    ];

    static tetrominosMap = {
        "tetromino_s": TetrominoS,
        "tetromino_n": TetrominoN,
        "tetromino_l": TetrominoL,
        "tetromino_r": TetrominoR,
        "tetromino_t": TetrominoT,
        "tetromino_o": TetrominoO,
        "tetromino_i": TetrominoI,
    };

    static randomCreate() {
        return new TetrominoFactory.tetrominos[Math.floor(Math.random() * TetrominoFactory.tetrominos.length)];
    }

    static createFromName(name) {
        return new TetrominoFactory.tetrominosMap[name];
    }
}