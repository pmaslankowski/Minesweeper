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

    var that = this;
    this.tiles = [];

	/* function creates tiles in html file
	 * Side effect: in html there appears content of game table */
	function createTiles() {
		var html = '';
		for (var i = 0; i < BOARD_HEIGHT; i++) {
			html += '\n<tr>';
			for (var j = 0; j < BOARD_WIDTH; j++) 
				html += `<td class="tile covered" id="tile${i}_${j}"></td>`;
			html += '\n</tr>';
		}
		$('#board').html(html);

        for(var i = 0; i < BOARD_HEIGHT; i++) {
            that.tiles[i] = []
            for(var j = 0; j < BOARD_WIDTH; j++)
                that.tiles[i][j] = new Tile(i, j);
        }
	}


	this.run = function() {
		createTiles();
        this.tiles[5][1].setState('tile empty');
	}
}

function Tile(i, j) {
    var that = this;

    this.id = `#tile${i}_${j}`; //CSS selector id
    this.elem = $(this.id); //DOM element

    this.i = i;
    this.j = j;

    this.state = 'tile covered';
    this.value = undefined;
    console.log($('#tile0_0').prop("tagName"));

    this.setState = function(state) {
        this.state = state;
        this.elem.attr('class', state);
    }

    this.elem.on('click', function () {
        that.setState('tile empty');
    });


}


//for test purposes only:
window.onload = function() {
	var game = new Game();
	game.run();
}