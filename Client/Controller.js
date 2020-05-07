import ServerConnection from './ServerConnection.js';

var serverConnection = new ServerConnection(gameStarted, gameFinished);
var id;
var mapWidth;
var mapHeight;

/*
function menu(){
    console.log('sending menu site request');
    serverConnection.sendRequest('menu');
}
*/


function savePreparationData(idP, widthP, heightP){
    id = idP;
    mapWidth = widthP;
    mapHeight = heightP;
}

function changeMapsCSS(){
    console.log((document.getElementsByClassName("timer"))[0]);
    console.log("readybtn");
    document.getElementsByClassName("timer")[0].style.color = "green";
    console.log((document.getElementsByClassName("timer"))[0]);
}

function gameStarted() {
    console.log('game started');
    //serverConnection.requestID();
    
    onkeypress = function(e) {
        switch (String.fromCharCode(e.keyCode)) {
            case 'w':
                serverConnection.sendChange('w');
                break;
            case 's':
                serverConnection.sendChange('s');
                break;
            case 'a':
                serverConnection.sendChange('a');
                break;
            case 'd':
                serverConnection.sendChange('d');
                break;
        
            default:
                break;
        }
    };
}

function gameFinished(){
    console.log('game finished');
    document.onkeypress = null;
}

export default savePreparationData;
