class Display {

    constructor(){}

    displayWorld(textAJAX){
        this.display(textAJAX, "game");
    }

    displayGameInfo(textAJAX){
        this.display(textAJAX, "gameInfo");
    }

    display(textAjax, id){
        document.getElementById(id).innerHTML = textAjax;
    }
}

export default Display;