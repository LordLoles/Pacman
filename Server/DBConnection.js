class DBConnection {
    
    constructor(){

    }

    getPlayerID(name, password){
        var playerID;

        playerID = Math.floor(Math.random() * 99);
        
        return playerID;
    }

}

module.exports = DBConnection;