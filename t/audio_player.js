export class AudioPlayer {
	static strikeAudio = new Audio("./assets/strike.wav");
	static clickAudio = new Audio("./assets/click.wav");
	static gameStartAudio = new Audio("./assets/game_start.wav");
	static gameOverAudio = new Audio("./assets/game_over.wav");
	static levelUpAudio = new Audio("./assets/level_up.wav");
	static clearLineAudio = new Audio("./assets/clear_line.wav");

	static initialize() {
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioCtx = new AudioContext();
	}

	static playStrikeAudio() {
		AudioPlayer.strikeAudio.currentTime = 0;
		AudioPlayer.strikeAudio.play();
	}

	static playClickAudio() {
		AudioPlayer.clickAudio.currentTime = 0;
		AudioPlayer.clickAudio.play();
	}

	static playClearLineAudio() {
		AudioPlayer.clearLineAudio.currentTime = 0;
		AudioPlayer.clearLineAudio.play();
	}

	static playGameStartAudio() {
		AudioPlayer.gameStartAudio.currentTime = 0;
		AudioPlayer.gameStartAudio.play();
	}

	static playGameOverAudio() {
		AudioPlayer.gameOverAudio.currentTime = 0;
		AudioPlayer.gameOverAudio.play();
	}

	static playLevelUpAudio() {
		AudioPlayer.levelUpAudio.currentTime = 0;
		AudioPlayer.levelUpAudio.play();
	}
}
