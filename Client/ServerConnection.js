import Display from './Display.js';
import savePreparationData from './Controller.js';


class ServerConnection {

    constructor(gameStart, gameFin){
        this.socket = io.connect("http://localhost:5000");
        //this.socket = io.connect("https://mutliplayer-pacman.herokuapp.com/");
        this.id;
        this.display = new Display();
        this.gameStart = gameStart;
        this.gameFin = gameFin;

        //console.log("listening");
        this.listenForMenu();
        this.listenForPreparation();
        this.listenForGame();
        this.listenForErrors();
    }

    sendChange(event){
        this.send('change', event);
    }

    send(tag, event){
        this.socket.emit(tag, {
            change: event
        });
    }

    sendRequest(tag){
        this.send(tag, null);
    }

    listenForGame(){
        var display = this.display;
        var gameStart = this.gameStart;
        var gameFin = this.gameFin;

        this.socket.on('change', function(state){
            display.displayWorld(state.world);
            display.displayGameInfo(state.gameInfo);
        });
        this.socket.on('gameStarted', function(){
            gameStart();
        });
        this.socket.on('gameFinished', function(){
            gameFin();
        });
    }

    listenForMenu(){
        var display = this.display;
        var logged = false;
        var ready = false;
        var socket = this.socket;

        this.socket.on('menuWhole', function(state){
            display.displayWorld(state.main);
            display.displayError("");
            logged = state.logged;
            ready = state.ready;

            //console.log("menu whole");

            socket.on("menu", function(state){
                display.displayMenu(state.readyButton, undefined, state.timer);

                document.getElementById("readybtn").addEventListener("click", function(){
                    console.log("ready");
                    display.displayError("");
                    socket.emit("ready", null);
                });

            });

            document.getElementById("loginbtn").addEventListener("click", function(){
                console.log("login");
                display.displayError("");
                socket.emit("login", {
                    name: document.getElementById("lname").value,
                    pass: document.getElementById("lpass").value
                });
            });

            document.getElementById("regbtn").addEventListener("click", function(){
                console.log("reg");
                display.displayError("");
                socket.emit("reg", {
                    name: document.getElementById("lname").value,
                    pass: document.getElementById("lpass").value
                });
            });

        });
    }

    listenForPreparation(){
        var display = this.display;

        this.socket.on('preparation', function(state){
            savePreparationData(state.id, state.width, state.height);
            display.displayWorld(state.main);
            display.displayGameInfo(state.timer);
        });
    }

    listenForErrors(){
        var display = this.display;

        this.socket.on('err', function(state){
            console.log("error", state.text);
            display.displayError(state.text);
        });
    }

    /*
    requestID(){
        this.sendRecieve('id', null).then(msg => {
            this.id = msg;
            console.log('received id:', this.id);
            this.socket.removeAllListeners("id");
        });
    }*/
    
    /*
    sendRecieve(tag, data) {
        return new Promise((resolve, reject) => {
            //console.log("client sending message with tag " + tag);
            this.socket.emit(tag, data, function(response) {
                //console.log("got response ", response);
                resolve(response);
            });
        });
    }*/

}

export default ServerConnection;
