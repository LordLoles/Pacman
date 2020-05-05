var express = require('express');
var socket = require('socket.io');
var PORT = process.env.PORT || 5000;

var app = express();
var server = app.listen (PORT, function(){
	console.log("server address:");
	console.log(server.address());
});
app.use(express.static('Client'));


Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
}


var io = socket(server);
var menuPage = new (require('./Server/MenuPage.js'))(preparationStarted);
var DBConnection = new (require('./Server/DBConnection.js'))();
var Maps = require('./Server/Map.js');

var connected = {};
var map = new Maps.ClassicMap();

let gameState;

var sendGameStateID;
var sendMenuPageToAllID;
var sendPreparationPageToAllID;
var mappedPlayersInGame; // {ingameID { id: DBID, name: DBname}}

menuStarted();

// All the listenings
io.on('connection', function(socket){
	console.log("made socket connecton");
	initPlayer();


	function initPlayer(){
		connected[socket.id] = {socket: socket, logged: false, ready: false};
	}

	function sendMenuPage(){
		socket.emit("menu", {
			main: menuPage.getMainMenu(connected[socket.id].ready, connected[socket.id].logged)
		});
	}


	socket.on('id', function(event, ackCallback){
		console.log('recieved id request');
		//ackCallback(playerID);
		//gameState = new (require('./Server/GameState.js'))(mappedPlayersInGame, map);
	});

	socket.on('change', function(event){
		//console.log("command " + event.change + " from player " + socket.playerID);
		var ingameID = playerIDbyDBID(socket.playerID)
		if (ingameID) gameState.move(ingameID, event.change);
	});

	socket.on('menu', function(){
		sendMenuPage();
	});

	socket.on('ready', function(){
		
		connected[socket.id].logged = connected[socket.id].playerID != undefined;
		if (connected[socket.id].logged) {
			if (connected[socket.id].ready){
				connected[socket.id].ready = false;
				menuPage.removeReadyPlayer(connected[socket.id].playerID);
			} else if (menuPage.canAddReadyPlayer()){
				connected[socket.id].ready = true;
				menuPage.addReadyPlayer(connected[socket.id].playerID, connected[socket.id].playerName);
			}
		}
		console.log("players ready:", menuPage.playersReady);
		sendMenuPage();
	});

	socket.on('login', function(state){
		menuPage.removeReadyPlayer(connected[socket.id].playerID);
		initPlayer();
		console.log("login", state);
		var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		if (format.test(state.name) || format.test(state.pass)) {
			socket.emit("err", {
				text: "name or password can not contain special characters!"
			});
		}
		else {
			connected[socket.id].playerID = DBConnection.getPlayerID(state.name, state.pass);
			if (connected[socket.id].playerID == undefined) {
				socket.emit("err", {
					text: "incorrect name or password!"
				});
			} else {
				connected[socket.id].logged = true;
				connected[socket.id].playerName = state.name;
				sendMenuPage(menuPage.getMainMenu(connected[socket.id].ready, connected[socket.id].logged), "");
			}
		}
	});

	socket.on('reg', function(state){
		menuPage.removeReadyPlayer(connected[socket.id].playerID);
		initPlayer();
        console.log('reg');
	});

    socket.on('disconnect', function () {
		menuPage.removeReadyPlayer(connected[socket.id].playerID);
		initPlayer();
        console.log('user disconnected');
	});
	
});




function playerIDbyDBID(dbID){
	for (var i = 0; i < Object.keys(mappedPlayersInGame).length; i++){
		if (mappedPlayersInGame[i]["id"] === dbID) return i;
	}
	return undefined;
}


function sendGameStateToAll(tag, main, sec){
	io.sockets.emit(tag, {
		world: main,
		gameInfo: sec
	});
}

function sendMenuPageToAll(){
	Object.values(connected).forEach(e => {
		e.socket.emit("menu", {
			main: menuPage.getMainMenu(e.ready, e.logged)
		});
	});
}

function sendPreparationPageToAll(preparationPage){
	var pageHTML = preparationPage.getMainMenu();
	var timerHTML = preparationPage.getTimerHTML();
	var length = Object.values(connected).length;

	for(var i = 0; i < length; i++){
		connected.socket.emit("preparation", {
			id: i,
			width: map.width,
			height: map.height,
			main: pageHTML,
			timer: timerHTML
		});
	}
}


function menuStarted(){
	TODO //nech neposiela vzdy cele menu, login nech sa zachova, alebo nech si klient vyberie, co chce.
	// rozdel JSON na menu do 3 sekcii podla dovov mozno...
	sendMenuPageToAllID = setInterval(sendMenuPageToAll, 1000);
}


function preparationStarted(){
	clearInterval(sendMenuPageToAllID);
	var preparationPage = new (require('./Server/PreparationPage.js'))(menuPage.playersReady, gameStarted);
	mappedPlayersInGame = preparationPage.players;
	sendPreparationPageToAllID = setInterval(sendPreparationPageToAll, 1000);
}


function gameStarted(){
	sendGameStateID = setInterval(sendGameState, 50);
}

function gameFinished(){
	clearInterval(sendGameStateID);
}


function sendGameState(){
	//console.log('sending changed state to all');
	if (gameState != undefined) 
		sendGameStateToAll('change', gameState.worldToAjax(), gameState.gameInfoToAjax());
}
