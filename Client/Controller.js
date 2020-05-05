import ServerConnection from './ServerConnection.js';

var serverConnection = new ServerConnection();
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
    changeMapsCSS();
}

function changeMapsCSS(){

}

function game() {
    console.log('sending id request');
    serverConnection.requestID();
    
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

export default savePreparationData;