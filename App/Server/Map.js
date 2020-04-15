
/* 
Maps field legend:
    0 - 4   => id of player
    10 - 14 => id of player + coin on ground
    5       => wall
    6       => nothing (background)
    7       => coin

Maps spawns[i] legend:
    it is for ghosts
    spawns[i] = (x, y), where 'field[x][y]' is the place to spawn.
*/


class AbstractMap {

    width;
    height;
    field; // = new Array [width] [height]; 
    spawns;

    constructor() {
        if (new.target === AbstractMap) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.spawns = new Array(0);
    }

    find(code){
        for(var i = 0; i < this.width; i++){
            for(var j = 0; j < this.height; j++){
                if(this.field[i][j] == code) return [i,j];
            }
        }
        return null;
    }

    getFreeSpawns(){
        var freeSpawns = [];
        var j = 0;
        for(var i = 0; i < this.spawns.length; i++){
            var spawn = this.spawns[i];
            var pos = this.field[spawn[0]][spawn[1]];
            if (pos == 6 || pos == 7) {
                freeSpawns[j] = spawn;
                j++;
            }
        }
        return freeSpawns;
    }

}

/*
class ClassicMap extends AbstractMap {

    constructor() {
        super();
        //this.width = 3;
        field = 
        [
            []
        ];
      }

}*/


class TestMap extends AbstractMap {

    constructor() {
        super();

        this.field = 
        [
            [0, 6, 6],
            [5, 7, 6],
            [5, 5, 6]
        ];

        this.width = this.field.length;
        this.height = this.field[0].length;

        this.spawns = new Array(2);
        this.spawns[0] = [0,2];
        this.spawns[1] = [2,2];
    }

}

module.exports = {
    AbstractMap: AbstractMap,
    TestMap: TestMap
}