class MenuPage {

    constructor(){
        this.playersReady = new Array();
    }

    addReadyPlayer(playerID){
        if (this.playersReady.includes(playerID)) return;
        if (!this.canAddReadyPlayer()) throw "there are already 5 players ready!";
        this.playersReady.push(playerID);
    }

    removeReadyPlayer(playerID){
        console.log("players index:", this.playersReady.findIndex(e => e == playerID));
        this.playersReady.splice(this.playersReady.findIndex(e => e == playerID), 1);
    }

    canAddReadyPlayer(){
        return this.playersReady.length < 5;
    }

    getMainMenu(ready, logged){
        var color;
        if(!logged) color = "grey";
        else if (ready) color = "green";
        else color = "#FF6464";
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
                '' +
            '</div>' +

        '</div>';
    }
}

module.exports = MenuPage;
