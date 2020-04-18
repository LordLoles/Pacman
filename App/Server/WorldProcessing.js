/* 
Maps field legend:
    0 - 4   => id of player
    10 - 14 => id of player + coin on ground
    20 - 24 => spawn of player with id
    5       => wall
    6       => nothing (background)
    7       => coin
*/

function drawMap(gameState) {
    gameState.world = "";
    for (var x = 0; x < gameState.map.width; x++) {
        for (var y = 0; y < gameState.map.height; y++) {
            switch (gameState.map.field[x][y]) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    drawPlayer(gameState, gameState.map.field[x][y]);
                    break;
                
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                    drawPlayer(gameState, gameState.map.field[x][y] - 10);
                    break;

                case 5:
                    gameState.world += "<div class='wall'></div>";
                    break;

                case 6:
                    gameState.world += "<div class='background'></div>";
                    break;

                case 7:
                    gameState.world += "<div class='coin'></div>";
                    break;
            
                default:
                    throw new TypeError("Invalid object in map field!");
            }
        }
        gameState.world += "<br>";
    }
}

function drawPlayer(gameState, id) {
    if (id === gameState.pacman)
    {
        gameState.world += "<div class='pacman'></div>";
        return;
    }
    gameState.world += "<div class='ghost" + id +"'></div>";
}

module.exports = drawMap;
