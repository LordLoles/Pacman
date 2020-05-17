class MenuStats {

    constructor(DBConnection) {
        this.DBConnection = DBConnection;
    }

    async getPlayerStatsHTML(loggedPlayerID, playerID){
        var loggedPlayerText = await this.getPlayerStatsOnlyLoggedHTML(loggedPlayerID);
        var queriedPlayer = await this.DBConnection.findPlayerByID(playerID);
    
        var allGames = await this.getLastPlayedGames(playerID);

        var avgPoints = await this.DBConnection.playersAveragePointsInMatches(playerID);
        var avgTime = await this.DBConnection.playersAverageTimeInMatches(playerID);

        /*
        console.log("id", playerID);
        console.log("games", allGames);
        console.log("avgPoints", avgPoints);
        console.log("avgTimePM", avgTime);*/

        return '' +
        loggedPlayerText +

        '<div id="playerMenuStatsName">' +
            '<p id="bigger">' + queriedPlayer.Name + '</p>' +
        '</div>' +

        '<div id="playerMenuStatsValues">' +
            '<div id="avgPoints">' +
                '<p id="smaller"></p>' +
                '<p id="smaller">avg points per game</p>' +
                '<p id="bigger">' + avgPoints + '</p>' +
            '</div>' +
            '<div id="avgTime">' +
                '<p id="smaller">avg time as</p><p id="smaller">pacman per game</p>' +
                '<p id="bigger">' + avgTime + '</p>' +
            '</div>' +
        '</div>' +

        '<div id="lastGames">' +
            this.gamesToHtml(allGames) +
        '</div>';
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
        allReses.sort((a,b) => {var p = b.Points - a.Points; if (p != 0) return p; else return (b.Time - a.Time);});

        if (allReses.length == 0) return -1;
        return allReses[0].IDPlayer;
    }

    gamesToHtml(allGames){
        var text = '<p id="smaller">Recent games</p>' +
        '<table><tbody>' +
        '<tr><th id="smaller">Date</th><th id="smaller">Result</th></tr>';

        allGames.forEach(game => {
            text += 
            //'<tr onClick="this.clickedGame(' + game.ID + ');">' + 
            '<tr id="' + game.ID + '" class="recentGameStat">' + 
                '<td><span class="yHover">' + game.Date + '</span></td>' +
                '<td><span class="yHover">' + game.res + '</span></td>' +
            '</tr>'
        });

        text += '</tbody></table>';
        return text;
    }

    async getLastPlayedGames(playerID){
        var allGamesIDs = await this.DBConnection.gamesIDsByPlayerID(playerID);
        var lastGamesToShow = 5;
        var allGames = new Array();
    
        for (const e of allGamesIDs){
            if (!lastGamesToShow) break;
            lastGamesToShow--;
    
            var game = await this.DBConnection.gameByID(e.IDGame);
            var winner = await this.gameWinner(game);
            if (winner == playerID) game.res = "win";
            else game.res = "lost";
            allGames.push(game);
        }

        return allGames;
    }

    async getPlayerStatsOnlyLoggedHTML(loggedPlayerID){
        var loggedPlayer = await this.DBConnection.findPlayerByID(loggedPlayerID);
        
        return '' +
        '<div id="loggedPlayer">' +
            '<div id="loggedPlayerName">' +
                '<p id="smaller">logged as</p>' +
                '<p id="bigger"><span class="yHover">' + loggedPlayer.Name + '</span></p>' +
            '</div>' +
            '<div id="loggedPlayerLogoutBtn">' +
                '<button id="logoutbtn" type="button">Log out</button>' +
            '</div>' +
        '</div>';
    }

    async getGameStatsByID(gameID){
        var game = await this.DBConnection.gameByID(gameID);
        var allResults = new Array();

        for (var i = 0; i < 5; i++){
            var resID = game["IDRes" + i];
            if (resID) {
                var result = await this.DBConnection.gameResultByID(resID);
                var player = await this.DBConnection.findPlayerByID(result.IDPlayer);
                result.PlayerName = player.Name;
                allResults.push(result);
            }
        }

        allResults.sort((a,b) => {var p = b.Points - a.Points; if (p != 0) return p; else return (b.Time - a.Time);});

        var text = '<div class="empty"></div>' +
        '<div class="gameStatsText">' +
        '<p id="bigger">Game statistics</p>' +
        '<p id="smaller">' + game.Date + '</p></div>' +
        '<div id="gameResults"><table>' +
        '<tr><th id="smaller">Player</th><th id="smaller">Points</th><th id="smaller">Time as pacman</th></tr>';

        allResults.forEach(e => {
            text += 
            '<tr>' +
                '<td class="playerOfGameStats" id="' + e.IDPlayer + '"><span class="yHover">' + e.PlayerName + '</span></td>' +
                '<td><span>' + e.Points + '</span></td>' +
                '<td><span>' + e.Time + '</span></td>' +
            '</tr>'
        });

        text += '</table></div>';
        return text;
    }

}

module.exports = MenuStats;