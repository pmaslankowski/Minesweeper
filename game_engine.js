/*
====================================
     WWW Course 2016
     List 6, exercise 1
     Minesweeper - level advanced
     Author: Piotr Maślankowski
====================================
           Game Engine Script       */
/// <reference path="jquery.d.ts"/>
const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 16;
const BOMBS_COUNT = 10;
const START_TIME = 300;
//main game class
class Game {
    constructor() {
        this.state = new Board(this);
    }
    /*Function changes and runs new state. */
    nextState(newState) {
        this.state = newState;
        this.state.run();
    }
    run() {
        this.state.run();
    }
}
class Board {
    constructor(game) {
        this.game = game;
        this.tiles = [];
        this.started = false;
        this.minesLeft = BOMBS_COUNT;
        this.timeLeft = START_TIME;
    }
    /* function creates tiles in html file
     * Side effects:
     *  -in html there appears content of game table
     *  -tiles array is filled                      */
    createTiles() {
        //HTML part:
        let html = '';
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            html += '\n<tr>';
            for (let j = 0; j < BOARD_WIDTH; j++)
                html += `<td class="tile covered" id="tile${i}_${j}"></td>`;
            html += '\n</tr';
        }
        $('#board').html(html);
        $('#minesLeft').html(this.minesLeft.toString());
        //Filling tiles array:
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < BOARD_WIDTH; j++)
                this.tiles[i][j] = new Tile(this, i, j);
        }
    }
    randBombs(excludedi, excludedj) {
        //function return random integer from range [low, high]
        function randInt(low, high) {
            return Math.floor(Math.random() * (high - low + 1) + low);
        }
        let currBombs = 0;
        while (currBombs < BOMBS_COUNT) {
            let i = randInt(0, BOARD_HEIGHT - 1);
            let j = randInt(0, BOARD_WIDTH - 1);
            if (i != excludedi && j != excludedj && this.tiles[i][j].value == '0') {
                this.tiles[i][j].setValue('bomb');
                currBombs++;
            }
        }
    }
    /*Function computes numbers on the board
      Side effect: tiles get values         */
    computeNumbers() {
        let directions = [[-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1], [1, -1],
            [1, 0], [1, 1]];
        for (let i = 0; i < BOARD_HEIGHT; i++)
            for (let j = 0; j < BOARD_WIDTH; j++)
                if (this.tiles[i][j].value == 'bomb')
                    for (let dir of directions) {
                        let newi = i + dir[0];
                        let newj = j + dir[1];
                        if (0 <= newi && newi < BOARD_HEIGHT && 0 <= newj && newj < BOARD_WIDTH) {
                            let currTile = this.tiles[newi][newj];
                            if (currTile.value != 'bomb')
                                currTile.value = String(parseInt(currTile.value) + 1); //adds 1 to current value
                        }
                    }
    }
    /*Function discover area after selecting point (i, j).
      This function performs DFS in fact.*/
    discover(starti, startj) {
        let directions = [[-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1], [1, -1],
            [1, 0], [1, 1]];
        //initializing visited array:
        let visited = [];
        for (let i = 0; i < BOARD_HEIGHT; i++) {
            visited[i] = [];
            for (let j = 0; j < BOARD_WIDTH; j++) {
                visited[i][j] = false;
            }
        }
        let stack = [[starti, startj]];
        //dfs:
        while (stack.length > 0) {
            //process current node:
            let last = stack.pop();
            let i = last[0];
            let j = last[1];
            visited[i][j] = true;
            let curr = this.tiles[i][j];
            curr.setState('uncovered');
            /* add neighbors: we don't have to check if on the tile is a bomb,
               because if there was one, algorithm wouldn't step here */
            if (curr.value == '0') {
                for (let dir of directions) {
                    let newi = i + dir[0];
                    let newj = j + dir[1];
                    if (0 <= newi && newi < BOARD_HEIGHT &&
                        0 <= newj && newj < BOARD_WIDTH &&
                        !visited[newi][newj])
                        stack.push([newi, newj]);
                }
            }
        }
    }
    discoverBombs() {
        for (let i = 0; i < BOARD_HEIGHT; i++)
            for (let j = 0; j < BOARD_WIDTH; j++)
                if (this.tiles[i][j].value == 'bomb' && this.tiles[i][j].state != 'boom')
                    this.tiles[i][j].setState('uncovered');
    }
    lose(i, j) {
        this.tiles[i][j].setState('boom');
        clearInterval(this.timer);
        this.discoverBombs();
        for (let i = 0; i < BOARD_HEIGHT; i++)
            for (let j = 0; j < BOARD_WIDTH; j++)
                $(this.tiles[i][j].id).off('mousedown');
        alert("Przegrałeś!");
        //this.hide();
    }
    checkWin() {
        let tilesLeft = BOARD_WIDTH * BOARD_HEIGHT;
        for (let i = 0; i < BOARD_HEIGHT; i++)
            for (let j = 0; j < BOARD_WIDTH; j++)
                if (this.tiles[i][j].state == 'uncovered')
                    tilesLeft--;
        console.log(tilesLeft);
        if (tilesLeft == BOMBS_COUNT)
            alert("Wygrałeś :)");
    }
    updateTime() {
        $('#timeLeft').html(this.timeLeft.toString());
        if (this.timeLeft > 0) {
            this.timeLeft--;
        }
        else
            this.lose(0, 0);
    }
    hide() {
        $('#gameScreen').hide();
    }
    //Function inits board, should be called after first click
    init(i, j) {
        this.randBombs(i, j);
        this.computeNumbers();
        this.started = true;
    }
    run() {
        this.createTiles();
        let that = this;
        this.timer = setInterval(function () { that.updateTime(); }, 1000);
    }
}
class Tile {
    constructor(board, i, j) {
        this.i = i;
        this.j = j;
        this.board = board;
        this.id = `#tile${i}_${j}`;
        this.value = '0';
        //event handlers:
        $(this.id).on('mousedown', (e) => {
            console.log(e.button);
            switch (e.button) {
                case 0:
                    //first click - init game
                    if (!this.board.started)
                        this.board.init(this.i, this.j);
                    //user clicked on tile consisting bomb
                    if (this.value == 'bomb') {
                        this.board.lose(this.i, this.j);
                        break;
                    }
                    if (this.state != 'flaged' && this.state != 'uncovered') {
                        board.discover(this.i, this.j);
                        board.checkWin();
                    }
                    break;
                case 2:
                    if (this.state == 'uncovered')
                        break;
                    if (this.state != 'flaged') {
                        this.setState('flaged');
                        this.board.minesLeft--;
                        $('#minesLeft').html(this.board.minesLeft.toString());
                    }
                    else {
                        this.setState('covered');
                        this.board.minesLeft++;
                        $('#minesLeft').html(this.board.minesLeft.toString());
                    }
                    break;
            }
        });
    }
    setState(state) {
        this.state = state;
        if (state == 'covered')
            $(this.id).attr('class', 'tile v0 ' + this.state);
        else
            $(this.id).attr('class', 'tile v' + this.value + ' ' + this.state);
    }
    setValue(val) {
        this.value = val;
    }
}
//for test purposes only:
window.onload = function () {
    var game = new Game();
    document.oncontextmenu = (e) => { return false; }; //disables contex menu on right click
    game.run();
};
