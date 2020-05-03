class PreparationPage {

    constructor(playersReady, TimerClass, functionAfter){
        this.functionAfter = functionAfter;
        this.TimerClass = TimerClass;
        this.timer = new this.TimerClass(5, this.functionAfter);
        this.players = this.mapPlayers(playersReady);
        this.timer.start();
        this.preparationPageHTML1 = '';
        this.preparationPageHTML2 = '';
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

}

module.exports = PreparationPage;
