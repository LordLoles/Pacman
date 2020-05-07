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
var DBConnection = new (require('./Server/DBConnection.js'))();
var menuPage;
var Maps = require('./Server/Map.js');

var connected = {}; // {socketID { socket: socket, logged: T/F, ready: T/F, playerID: DBID. playerName: DBname }}
var map = new Maps.ClassicMap();

let gameState;

var sendGameStateID;
var sendMenuPageToAllID;
var sendPreparationPageToAllID;
var sendgameStartingID;

var mappedPlayersInGame; // {ingameID { id: DBID, name: DBname}}

menuStarted();

// All the listenings
io.on('connection', function(socket){
	console.log("made socket connecton");
	initPlayer();
	sendMenuPageWholeToOne(connected[socket.id]);


	function initPlayer(){
		connected[socket.id] = {socket: socket, logged: false, ready: false};
	}

	/*
	socket.on('id', function(event, ackCallback){
		console.log('recieved id request');
		//ackCallback(playerID);
		gameState = new (require('./Server/GameState.js'))(mappedPlayersInGame, map);
	});*/

	socket.on('change', function(event){
		var ingameID = inGameIDbyDBID(connected[socket.id].playerID);
		//console.log("command " + event.change + " from player " + ingameID);
		if (ingameID != undefined) gameState.move(ingameID, event.change);
	});

	socket.on('menu', function(){
		sendMenuPageWhole();
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
		sendMenuPageToAll();
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
				sendMenuPageToAll();
			}
		}
	});

	socket.on('reg', function(state){
		menuPage.removeReadyPlayer(connected[socket.id].playerID);
		initPlayer();
        console.log('reg');
		sendMenuPageWhole();
	});

    socket.on('disconnect', function () {
		menuPage.removeReadyPlayer(connected[socket.id].playerID);
		initPlayer();
        console.log('user disconnected');
	});
	
});



function inGameIDbyDBID(dbID){
	for (var i = 0; i < Object.keys(mappedPlayersInGame).length; i++){
		if (mappedPlayersInGame[i]["id"] == dbID) return i;
	}
	return undefined;
}



function sendGameStateToAll(main, sec){
	io.sockets.emit('change', {
		world: main,
		gameInfo: sec
	});
}

function sendMenuPageWholeToOne(connection){
	connection.socket.emit("menuWhole", {
		main: menuPage.getMainMenu(connection.ready, connection.logged)
	});
}

function sendMenuPageWhole(){
	Object.values(connected).forEach(e => {
		sendMenuPageWholeToOne(e);
	});
}

function sendMenuPageToOne(connection){
	var color = menuPage.colorOfReadyButton(connection.ready, connection.logged);
	connection.socket.emit("menu", {
		readyButton: menuPage.getReadyButtonInner(color),
		timer: menuPage.getTimerInner()
	});
}

function sendMenuPageToAll(){
	Object.values(connected).forEach(e => {
		sendMenuPageToOne(e);
	});
}

function sendPreparationPageToAll(preparationPage){
	var pageHTML = preparationPage.getMainHTML();
	var timerHTML = preparationPage.getTimerHTML();
	var width = map.width;
	var height = map.height;

	Object.values(connected).forEach(e => {
		var inGameID = inGameIDbyDBID(e.playerID);
		e.socket.emit("preparation", {
			id: inGameID,
			width: width,
			height: height,
			main: pageHTML,
			timer: timerHTML
		});
	});
}

function sendGameState(){
	//console.log('sending changed state to all');
	//if (gameState != undefined) 
		sendGameStateToAll(gameState.worldToAjax(), gameState.gameInfoToAjax());
}



function menuStarted(){
	//clearInterval(sendGameStateID);
	Object.values(connected).forEach(e => {
		e.ready = false;
	});
	clearInterval(sendGameStateID);
	menuPage = new (require('./Server/MenuPage.js'))(preparationStarted, sendMenuPageToAll);
	sendMenuPageWhole();
	Object.values(connected).forEach(e => {
		if (e.logged) sendMenuPageToOne(e);
	});
	//console.log("menu start");
	//sendMenuPageToAllID = setInterval(sendMenuPageToAll, 1000);
}

function preparationStarted(){
	clearInterval(sendMenuPageToAllID);
	map = new Maps.ClassicMap();
	var preparationPage = new (require('./Server/PreparationPage.js'))(menuPage.playersReady, gameStarting);
	mappedPlayersInGame = preparationPage.players;
	sendPreparationPageToAllID = setInterval(sendPreparationPageToAll, 1000, preparationPage);
}

function gameStarting(){
	clearInterval(sendPreparationPageToAllID);
	gameState = new (require('./Server/GameState.js'))(mappedPlayersInGame, map, gameStarted);
	sendGameStateID = setInterval(sendGameState, 50);
}

function gameStarted(){
	io.sockets.emit('gameStarted', null);
	gameState.start(gameFinished);
}

function gameFinished(){
	gameState.end(menuStarted);
	io.sockets.emit("gameFinished", null);
}
