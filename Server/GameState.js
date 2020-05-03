var Maps = require('./Map.js');
var Player = require('./Player.js');
var WorldProcessing = require('./WorldProcessing.js');
var GameLogic = require('./GameLogic.js');
const performance = require('perf_hooks').performance;


class GameState {

    
    constructor(mapped) {
        this.map = new Maps.ClassicMap();
        this.gameLogic = new GameLogic(this.map);
        this.pacman; //id of player
        this.ghostSpeed = 290;
        this.pacmanSpeed = 190;
        var noPlayers = Object.keys(mapped).length;

        this.players = new Array (noPlayers);
        for(var i = 0; i < noPlayers; i++){
            var player = new Player(i);
            this.players[i] = player;
            if (i != 0) {
                this.setGhost(i);
                this.gameLogic.spawnGhost(player, 0);
            }
        }


        this.setPacman(0);
    }

    move(playerID, direction){
        let player = this.players[playerID];
        let newX = player.x;
        let newY = player.y;
        switch(direction){
            case 'w':
                newX--;
                break;
            case 's':
                newX++;
                break;
            case 'a':
                newY--;
                break;
            case 'd':
                newY++;
                break;
        
            default:
                return;
        }

        //console.log("moving", player, "to", newX, newY);

        if (this.gameLogic.canMove(player, newX, newY, this.pacman)) {
            //console.log("can move here", playerID, "->", newX, newY);
            this.gameLogic.movePlayer(player, newX, newY, this.pacman);

            //console.log("player", player);
            //console.log("map", this.map.field);
            //console.log("move done");
            this.moveDone(playerID);
        }
        
    }

    moveDone(playerID){
        var player = this.players[playerID];
        if (this.pacmanOnCoin(player)){
            player.points += 1;
            this.map.field[player.x][player.y] -= 10;
        }
        if (this.gameLogic.pacmanEaten != -1){
            let eating = this.gameLogic.pacmanEaten;
            let eaten = this.pacman;
            if (playerID == eating || playerID == eaten){
                this.pacman = this.gameLogic.pacmanEaten;
                //console.log("new pacman", this.pacman);
                this.gameLogic.spawnGhost(this.players[eaten], eating);
                this.setGhost(eaten);
                this.players[this.pacman].moveSpeed = this.pacmanSpeed;

                this.gameLogic.pacmanEaten = -1;
            }
        }
    }

    pacmanOnCoin(player){
        return  (this.pacman == player.id) && 
                (this.map.field[player.x][player.y] >= 10) && 
                (this.map.field[player.x][player.y] <= 14);
    }

    setPacman(playerID){
        this.pacman = playerID;
        var player = this.players[playerID]

        var pacmanPos = this.map.find(0);
        player.x = pacmanPos[0];
        player.y = pacmanPos[1];
        //console.log("pacman found at " + player.x + " " + player.y);

        player.moveSpeed = this.pacmanSpeed;
        player.lastMove = performance.now() + 250;
    }

    setGhost(playerID){
        var player = this.players[playerID]
        player.moveSpeed = this.ghostSpeed;
        player.lastMove = performance.now() + 1000;
    }

    worldToAjax(){
        return WorldProcessing.drawMap(this);
    }

    gameInfoToAjax(){
        return WorldProcessing.drawGameInfo(this);
    }
}

module.exports = GameState;
