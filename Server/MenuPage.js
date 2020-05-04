var Timer = require('./Timer.js');

class MenuPage {

    constructor(functionAfter){
        this.playersReady = {};
        this.functionAfter = functionAfter;
        this.timer = new Timer('-');
    }

    addReadyPlayer(playerID, playerName){
        if (this.playersReady[playerID] != undefined) return;
        if (!this.canAddReadyPlayer()) throw "there are already 5 players ready!";

        this.playersReady[playerID] = playerName;

        var playersReadyLength = this.playersReadyLength();
        if (playersReadyLength >= 2 && playersReadyLength < 5){
            this.newTimerStart(2);
        } else if (playersReadyLength == 5) {
            this.newTimerStart(3);
        } else {
            this.newTimer('-');
        }
    }

    newTimer(seconds){
        this.timer.stop();
        this.timer = new Timer(seconds, this.functionAfter);
    }

    newTimerStart(seconds){
        this.newTimer(seconds);
        this.timer.start();
    }

    removeReadyPlayer(playerID){
        //console.log("players index:", this.playersReady.findIndex(e => e == playerID));
        delete this.playersReady[playerID];
        if (this.playersReadyLength() < 2) {
            this.newTimer('-');
        }
    }

    playersReadyLength(){
        return Object.keys(this.playersReady).length;
    }

    canAddReadyPlayer(){
        return this.playersReadyLength() < 5;
    }

    getMainMenu(ready, logged){
        var color = this.colorOfReadyButton(ready, logged);
        return '' +
        '<div class="menu">' +

            '<div class="readyButton">' +
                '<button style="background-color: ' + color + '; border-color: ' + color + ';" id="readybtn" type="button">READY!</button>' +
            '</div>' +

            '<div class="login">' +
                '<label for="lname">Nickname</label><br>' +
                '<input type="text" id="lname" name="lname" value="quest"><br><br>' +
                '<label for="lpass">Password</label><br>' +
                '<input type="password" id="lpass" name="lpass" value="123"><br><br>' +
                '<button id="loginbtn" type="button">Log In</button><br>' +
                '<button id="regbtn" type="button">Register</button>' +
            '</div>' +

            '<div class="stats">' +
                '<div class="timer">' +
                    this.timer.toHTML() +
                '</div>' +
                this.playersReadyToHTML() +
            '</div>' +

        '</div>';
    }

    colorOfReadyButton(ready, logged){
        if(!logged) return "grey";
        else if (ready) return "green";
        else return "#FF6464";
    }

    playersReadyToHTML(){
        var ret = "<p> Players Ready:</p>";
        Object.values(this.playersReady).forEach(element => {
            ret += "<p>" + element + "</p>";
        });
        return ret;
    }

}

module.exports = MenuPage;
