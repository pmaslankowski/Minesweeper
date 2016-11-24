/*
====================================
WWW Course 2016
	 List 6, exercise 1
	 Minesweeper - level advanced
	 Author: Piotr Maślankowski 
====================================
	       Game Engine Script       */



const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 16;



//main game object
function Game() {
	this.state = new Board(this); //state can be one of following objects: MainMenu, Board, Final
	
	this.run = function() { 
		this.state.run();
	}
}



//Board object, which manages game phase
function Board(game) {

	/* function creates tiles in html file
	 * Side effect: in html there appears content of game table */
	function createTiles() {
		var html = '';
		for(var i = 0; i < BOARD_HEIGHT; i++) {
			html += '\n<tr>';
			for(var j = 0; j < BOARD_WIDTH; j++) 
				html += `<td class="tile" id="${i}, ${j}"></td>`;
			html += '\n</tr>';
		}
		console.log(html);
		$('#board').html(html);
	}


	this.run = function() {
		createTiles();
	}
}


//for test purposes only:
window.onload = function() {
	var game = new Game();
	game.run();
}