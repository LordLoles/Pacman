/* 
Maps field legend:
    0 - 4   => id of player
    10 - 14 => id of player + coin on ground
    5       => wall
    6       => nothing (background)
    7       => coin
*/

function drawMap(gameState) {
   var world = "";
    for (var x = 0; x < gameState.map.width; x++) {
        for (var y = 0; y < gameState.map.height; y++) {
            switch (gameState.map.field[x][y]) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    world += drawPlayer(gameState, gameState.map.field[x][y]);
                    break;
                
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    world += drawPlayer(gameState, gameState.map.field[x][y] - 10);
                    break;

                case 5:
                    world += "<div class='wall'></div>";
                    break;

                case 6:
                    world += "<div class='background'></div>";
                    break;

                case 7:
                    world += "<div class='coin'></div>";
                    break;
            
                default:
                    throw new TypeError("Invalid object in map field!");
            }
        }
        world += "<br>";
    }
    return world;
}

function drawPlayer(gameState, id) {
    if (id === gameState.pacman){
        return "<div class='pacman'></div>"
    }
    return "<div class='ghost" + id + "'></div>";
}

function drawGameInfo(gameState) {
    var players = gameState.players.sort((a, b) => b - a);

    var gameInfo = "";

    gameInfo += "<div id='time'>";


    gameInfo += "</div>";
    gameInfo += "<div id='score'>";

    players.forEach(player => {
        gameInfo += "<div id='color" + player.id + "'>";
        gameInfo += player.id; //player.name TODO
        gameInfo += " -> " + player.points;
        gameInfo += "</div>"

    });

    gameInfo += "</div>";

    return gameInfo;
}

module.exports = {drawMap, drawGameInfo};
