const performance = require('perf_hooks').performance;

class GameLogic {

    constructor(map) {
        this.map = map;
        this.pacmanEaten = -1; //id of player that had eaten pacman on move, or -1 if none had.
    }

    canMove(player, newX, newY, pacman){

        if (!((newX >= 0) && (newY >= 0) && (newX < this.map.width) && (newY < this.map.height))) return false;

        var pos = this.map.field[newX][newY];

        if (
            ((pos == pacman) || (pos == 6) || (pos == 7) || 
                ((player.id == pacman) && ((pos <= 4) || (pos <= 14 && pos >= 10))))
            &&
            (player.lastMove + player.moveSpeed <= performance.now())
        ) return true;

        return false;
    }

    undefPlayersPos(player){
        var pos = this.map.field[player.x][player.y];
        if (pos <= 4) this.map.field[player.x][player.y] = 6;
        else this.map.field[player.x][player.y] = 7;

        player.x = undefined;
        player.y = undefined;
    }

    destroyPlayer(player){
        this.undefPlayersPos(player);
        // send message
    }

    movePlayer(player, newX, newY, pacman){
        this.undefPlayersPos(player);
        this.movePlayerTo(player, newX, newY, pacman);
    }

    movePlayerTo(player, newX, newY, pacman){
        var pos = this.map.field[newX][newY];
        if (pos == 6) this.map.field[newX][newY] = player.id;
        else if (pos == 7) this.map.field[newX][newY] = player.id + 10;
        else if (pos == pacman) {
            this.map.field[newX][newY] = player.id;
            this.pacmanEaten = player.id;
        }
        else if ((player.id == pacman) && (pos <= 4)){
            this.pacmanEaten = pos;
        }
        else if ((player.id == pacman) && (pos <= 14 && pos >= 10)){
            this.pacmanEaten = pos - 10;
        }
        else throw new TypeError("Invalid move! ", player.id, newX, newY);

        player.x = newX;
        player.y = newY;
        player.lastMove = performance.now();

        //console.log("player", player);
        //console.log("map", this.map.field);
    }

    // player is object, pacman is ID
    spawnGhost(player, pacman){
        var freeSpawns = this.map.getFreeSpawns();
        if (freeSpawns.length > 0){
            var spawn = freeSpawns[Math.floor(Math.random() * freeSpawns.length)];
            this.movePlayerTo(player, spawn[0], spawn[1], pacman);
        }
        else {
            setTimeout(this.spawnGhost(player, pacman), 500);
        }
    }
}

module.exports = GameLogic;