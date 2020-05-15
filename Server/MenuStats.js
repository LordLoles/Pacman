class MenuStats {

    constructor(DBConnection) {
        this.DBConnection = DBConnection;
    }

    async getPlayerStatsHTML(loggedPlayerID, playerID){
        var allGamesIDs = await this.DBConnection.gamesIDsByPlayerID(playerID);
        var lastGamesToShow = 5;
        var allGames = new Array();
    
        for (const e of allGamesIDs){
            if (!lastGamesToShow) break;
            lastGamesToShow--;
    
            var game = await this.DBConnection.gameByID(e.IDGame);
            var winner = await this.gameWinner(game);
            console.log("win of", e.IDGame, winner);
            if (winner == playerID) game.res = "win";
            else game.res = "lost";
            allGames.push(game);
        }
    

        var avgPoints = await this.DBConnection.playersAveragePointsInMatches(playerID);
        var avgTime = await this.DBConnection.playersAverageTimeInMatches(playerID);

        console.log("id", playerID);
        console.log("games", allGames);
        console.log("avgPoints", avgPoints);
        console.log("avgTimePM", avgTime);

        return '' +
        '<div id="playerMenuStats">' +
            '' +TODO[]
        '</div>'
        ;
    }

    async gameWinner(game){
        var allReses = new Array();
        for (var i = 0; i < 5; i++){
            var resID = game['IDRes' + i];
            if (resID) {
                var res = await this.DBConnection.gameResultByID(resID);
                allReses.push(res);
            }
        }
        allReses.sort((a,b) => {var p = b.Points - a.Points; if (p) return p; else return (b.Time - a.Time);});

        if (allReses.length == 0) return -1;
        return allReses[0].IDPlayer;
    }
}

module.exports = MenuStats;