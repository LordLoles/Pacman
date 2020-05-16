class Display {

    constructor(){}

    displayWorld(text){
        this.display(text, "game");
    }

    displayGameInfo(text){
        this.display(text, "gameInfo");
    }

    displayMenuStats(upper, lower){
        if (upper) document.getElementById("menuStatsPlayer").innerHTML = upper;
        if (lower) document.getElementById("menuStatsGame").innerHTML = lower;
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