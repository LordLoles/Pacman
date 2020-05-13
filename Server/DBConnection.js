const { Client } = require('pg');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

//heroku
const client = new Client({
    host: "ec2-34-195-169-25.compute-1.amazonaws.com",
    user: "oimduyhitdlkdi",
    password: "0155ad836fb0d73746614b38e4bf5c26f1106c257a9285ba0ef591106fa2bc54",
    database: "d9ahtk4ls6n4je",
    ssl: true
});

//local
/*
host: localhost,
database: Pacman,
*/

//client.connection.ssl = false;

console.log("Connecting to DB");
// postgres://oimduyhitdlkdi:0155ad836fb0d73746614b38e4bf5c26f1106c257a9285ba0ef591106fa2bc54@ec2-34-195-169-25.compute-1.amazonaws.com:5432/d9ahtk4ls6n4je

client.connect()
.then(() => console.log("DB connected successfuly"))
.catch((e) => console.log("DB error\n", e));


class DBConnection {
    
    constructor(){
        //this.queryRes('SELECT * FROM public."Games";').then((a) => console.log("last game", a.res[a.res.length-1]));
    }

    getPlayerID(name, password){
        return this.queryRes('SELECT p."ID" FROM public."Players" AS p WHERE p."Name"=\'' + name + '\' AND p."Password"=\'' + password + '\';')
        .then(function(a) {if (a.err) throw a.err; else return a.res;})
        //.then(function(res) {console.log(res); res.length ? console.log("true") : console.log("false"); return res;})
        .then((res) => res.length ? res[0].ID : undefined)
    }

    findName(name){
        return this.queryRes('SELECT p."ID" FROM public."Players" AS p WHERE p."Name"=\'' + name + '\';')
        .then(function(a) {if (a.err) throw a.err; else return a.res;})
        .then((res) => res.length ? res[0].ID : undefined)
    }

    regPlayer(name, password){
        return this.query('INSERT INTO public."Players" ("Name", "Password") VALUES (\'' + name + '\', \'' + password + '\');')
        .then(function(a) {if (a.err) throw a.err; else return a.rows;});
    }

    deletePlayer(name, password){
        return this.queryRes('DELETE FROM public."Players" AS p WHERE p."Name"=\'' + name + '\' AND p."Password"=\'' + password + '\';');
    }

    async insertGameData(mappedPlayersInGame, players){
        var gameID = await this.insertGame();
        var resIDs = new Array(players.length);

        for(var i = 0; i < players.length; i++){
            var dbID = mappedPlayersInGame[players[i].id].id;
            resIDs[i] = await this.insertResult(gameID, dbID, players[i]);
            this.makeJoin(gameID, dbID);
        }
        
        for(var i = 0; i < players.length; i++){
            var dbID = mappedPlayersInGame[players[i].id].id;
            this.updateGame(gameID, resIDs);
        }
    }

    // Also returns id of game, that was created in DB
    insertGame(){
        return this.queryRes('INSERT INTO public."Games" DEFAULT VALUES RETURNING "ID";')
        .then(function(a) {if (a.err) throw a.err; else return a.res[0].ID;});
    }

    updateGame(gameID, resIDs){
        var query = 'UPDATE public."Games" SET';

        for(var i = 0; i < resIDs.length; i++){
            if (i != 0) query += ',';
            query += ' "IDRes' + i + '"=' + resIDs[i];
        }

        query += ' WHERE "ID"=' + gameID;
        return this.query(query)
        .then(function(a) {if (a.err) throw a.err; else return a;});
    }

    // Also returns id of result, that was created in DB
    async insertResult(gameID, playerDBID, player){
        return this.queryRes('INSERT INTO public."Results" ("IDPlayer", "IDGame", "Points", "Time") VALUES (' + playerDBID + ', ' + gameID + ', ' + player.points + ', ' + player.timePacman + ') RETURNING "ID";')
        .then(function(a) {if (a.err) throw a.err; else return a.res[0].ID;});
    }

    makeJoin(gameID, playerDBID){
        return this.query('INSERT INTO public."Join" VALUES (' + playerDBID + ', ' + gameID + ');')
        .then(function(a) {if (a.err) throw a.err; else return a;});
    }


    async queryRes(text){
        var a = await this.query(text);
        return {err: a.err, res: a.res.rows};
    }

    async query(text){
        try{
            var err;
            var res;
            await client.query("BEGIN");
            await client.query(text, (e, r)=> {
                err = e;
                res = r;
            });
            await client.query("COMMIT");
            return {err: err, res: res};
        }
        catch(e){
            console.log("DB error\n", e);
            await client.query("ROLLBACK");
        }
        finally{
        }
    }

}

module.exports = DBConnection;