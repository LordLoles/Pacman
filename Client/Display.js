class Display {

    constructor(){}

    displayWorld(text){
        this.display(text, "game");
    }

    displayGameInfo(text){
        this.display(text, "gameInfo");
    }

    displayMenuStats(upper, lower, clear=false){
        var upperHtML = document.getElementById("menuStatsPlayer");
        var lowerHTML = document.getElementById("menuStatsGame");
        if (clear) {
            if (upperHtML) upperHtML.innerHTML = "";
            if (lowerHTML) lowerHTML.innerHTML = "";
        }
        if (upper && upperHtML) upperHtML.innerHTML = upper;
        if (lower && lowerHTML) lowerHTML.innerHTML = lower;
    }

    displayMenu(readyButton, login, timer){
        if (readyButton) document.getElementsByClassName("readyButton")[0].innerHTML = readyButton;
        if (login) document.getElementsByClassName("login")[0].innerHTML = login;
        if (timer) document.getElementsByClassName("stats")[0].innerHTML = timer;
    }

    displayError(text){
        document.getElementsByClassName("err")[0].innerHTML = text;
        /*
        var errDiv = document.getElementsByClassName("err")[0];
        if (text) 
        {
            errDiv.innerHTML = text;
            errDiv.style.color = "red";
        } else {
            errDiv.innerHTML = "no error!";
            errDiv.style.color = "black";
        }*/
    }

    display(text, id){
        document.getElementById(id).innerHTML = text;
    }

}

export default Display;