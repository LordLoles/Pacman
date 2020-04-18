
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
        this.coinSpawner;
    }

    finish(){
        this.width = this.field.length;
        this.height = this.field[0].length;
        this.coinSpawner = new CoinSpawner(this.map);
    }

    find(code){
        for(var i = 0; i < this.width; i++){
            for(var j = 0; j < this.height; j++){
                if(this.field[i][j] == code) return [i,j];
            }
        }
        return null;
    }

    findAll(code){
        var all = [];
        var k = 0;
        for(var i = 0; i < this.width; i++){
            for(var j = 0; j < this.height; j++){
                if(this.field[i][j] == code) {
                    all[k] = [i,j];
                    k++;
                }
            }
        }
        return all;
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

    getFreeCoinPos(){
        return this.findAll(6);
    }

}


class ClassicMap extends AbstractMap {

    constructor() {
        super();
        //this.width = 3;
        this.field = 
        [ // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], //0
            [5, 6, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 5], //1
            [5, 6, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5, 5, 6, 5], //2
            [5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5], //3
            [5, 6, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 6, 5], //4
            [5, 6, 6, 6, 6, 5, 6, 6, 6, 5, 6, 6, 6, 5, 6, 6, 6, 6, 5], //5
            [5, 5, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5, 5, 5, 5], //6
            [5, 5, 5, 5, 6, 5, 6, 6, 6, 6, 6, 6, 6, 5, 6, 5, 5, 5, 5], //7
            [5, 5, 5, 5, 6, 5, 6, 5, 5, 6, 5, 5, 6, 5, 6, 5, 5, 5, 5], //8
            [5, 5, 5, 5, 6, 6, 6, 5, 6, 6, 6, 5, 6, 6, 6, 5, 5, 5, 5], //9
            [5, 5, 5, 5, 6, 5, 6, 5, 5, 6, 5, 5, 6, 5, 6, 5, 5, 5, 5], //10
            [5, 5, 5, 5, 6, 5, 6, 6, 6, 6, 6, 6, 6, 5, 6, 5, 5, 5, 5], //11
            [5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5], //12
            [5, 6, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 5], //13
            [5, 6, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5, 5, 6, 5], //14
            [5, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 6, 6, 5], //15
            [5, 5, 6, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 6, 5, 5], //16
            [5, 6, 6, 6, 6, 5, 6, 6, 6, 5, 6, 6, 6, 5, 6, 6, 6, 6, 5], //17
            [5, 6, 5, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 5, 6, 5], //18
            [5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5], //19
            [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]  //20
        ];
        

        this.spawns = new Array(5);
        this.spawns[0] = [9,9];
        this.spawns[1] = [8,9];
        this.spawns[2] = [10,9];
        this.spawns[3] = [9,8];
        this.spawns[4] = [9,10];

        //pacmanspawn
        this.field[9][4] = 0;

        this.finish();
      }

}


class TestMap extends AbstractMap {

    constructor() {
        super();

        this.field = 
        [
            [0, 6, 6],
            [5, 6, 6],
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
    TestMap: TestMap,
    ClassicMap: ClassicMap
}