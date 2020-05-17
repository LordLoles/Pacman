import ServerConnection from './ServerConnection.js';

var serverConnection = new ServerConnection(gameStarted, gameFinished, changeMapsCSS);
var id;
var mapWidth;
var mapHeight;
var gameRunning = false;


//document.getElementsByTagName("BODY")[0].onresize = changeMapsCSS;


function savePreparationData(idP, widthP, heightP){
    id = idP;
    mapWidth = widthP;
    mapHeight = heightP;
}

//funkcia sa nikdy nevola
function changeMapsCSS(){
    if (!gameRunning) return;
    console.log("changing CSS");

    var sizeOfBlock = Math.min([Math.floor(100*gameWidth/mapWidth), Math.floor(100*gameHeight/mapHeight)]);

    var elements = ["wall", "coin", "background", "pacman", "ghost0", "ghost1", "ghost2", "ghost3", "ghost4"];

    elements.forEach(e => {
        Array.from(document.getElementsByClassName(e)).forEach(d => {
            d.style.width = sizeOfBlock + "px";
            d.style.height = sizeOfBlock + "px";
        });
    });

    /*
    fs.writeFile('./stylesGame.css', data, function (err){
        if (err) throw err;
    });*/

    /*
    if (!gameRunning) return;
    var gameWidth = document.getElementById('game').clientWidth;
    var gameHeight = document.getElementById('game').clientHeight;
    var sizeOfBlock = Math.min([Math.floor(100*gameWidth/mapWidth), Math.floor(100*gameHeight/mapHeight)]);
    console.log("size of blocks", sizeOfBlock);
    //console.log("divs", document.getElementById('game').getElementsByTagName("div"));
    Array.from(document.getElementById('game').getElementsByTagName("div")).forEach(e => {
        e.style.width = sizeOfBlock + "px";
        e.style.height = sizeOfBlock + "px";
    });*/
}

function gameStarted() {
    console.log('game started');
    gameRunning = true;
    
    onkeypress = function(e) {
        if (!gameRunning) return;
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
    gameRunning = false;
    onkeypress = null;
}

export default savePreparationData;
