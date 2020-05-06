class Display {

    constructor(){}

    displayWorld(text){
        this.display(text, "game");
    }

    displayGameInfo(text){
        this.display(text, "gameInfo");
    }

    displayMenu(readyButton, login, timer){
        if (readyButton) document.getElementsByClassName("readyButton")[0].innerHTML = readyButton;
        if (login) document.getElementsByClassName("login")[0].innerHTML = login;
        if (timer) document.getElementsByClassName("stats")[0].innerHTML = timer;
    }

    display(text, id){
        document.getElementById(id).innerHTML = text;
    }

}

export default Display;