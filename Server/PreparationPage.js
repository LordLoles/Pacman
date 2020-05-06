var Timer = require('./Timer.js');

class PreparationPage {

    constructor(playersReady, functionAfter){
        this.timer = new Timer(5, functionAfter);
        this.players = this.mapPlayers(playersReady); // {ingameID { id: DBID, name: DBname}}
        this.noPlayers = Object.keys(this.players).length;
        //console.log("timer:", this.timer);
        this.timer.start();
    }

    mapPlayers(playersReady){
        var mapped = {};
        var names = Object.values(playersReady);
        var ids = Object.keys(playersReady);
        var length = ids.length;

        var rands = new Array(length);
        for (var i = 0; i < length; i++){
            rands[i] = i;
        }
        rands.shuffle();
        
        for (var i = 0; i < length; i++){
            mapped[i] = {id: ids[rands[i]], name: names[rands[i]]};
        }

        /*
        console.log("r", rands);
        console.log("p", playersReady);
        console.log("n", names);
        console.log("m", mapped);
        */

        return mapped;
    }

    getPlayerHTML(id){
        return '' +
            '<div class="player' + id + '">' +
                '<div class="ghost' + id + '"></div>' +
                '<p>' + this.players[id].name + '</p>' +
            '</div>'
        ;
    }

    getMainHTML(){
        var ret = '<div class="preparation"> <div class="stats">Game starting</div> <div class="players">';
        for(var i = 0; i < this.players; i++){
            ret += this.getPlayerHTML(i);
        }
        ret += '<div class"playerp"><div class"pacman"></div><p>' + this.players[0].name + '<br>starts as pacman!</p></div>';
        ret += '</div></div>';

        return ret;
    }

    getTimerHTML(){
        return this.timer.toDivHTML();
    }

}

module.exports = PreparationPage;
