var express = require('express');
var socket = require('socket.io');
var PORT = process.env.PORT || 8886;

var app = express();
var server = app.listen (PORT, function(){
	console.log("server address:");
	console.log(server.address());
});
app.use(express.static('Client'));


var io = socket(server);
var menuPage = new (require('./Server/MenuPage.js'))();
var DBConnection = new (require('./Server/DBConnection.js'))();

let gameState;


// All the listenings
io.on('connection', function(socket){
	console.log("made socket connecton");
	var playerID = undefined;
	var logged = false;
	var ready = false;


	function sendMenuPage(main, sec){
		socket.emit("menu", {
			main: main,
			info: sec
		});
	}

	
	socket.on('id', function(event, ackCallback){
		console.log('recieved id request');
		//ackCallback(playerID);
		//gameState = new (require('./Server/GameState.js'))(playerID);
	});

	socket.on('change', function(event){
		//console.log("command " + event.change + " from player " + socket.playerID);
		gameState.move(socket.playerID, event.change);
	});

	socket.on('menu', function(){
		sendMenuPage(menuPage.getMainMenu(false, false), "");
	});

	socket.on('ready', function(){
		logged = playerID != undefined;
		if (logged) {
			if (ready){
				ready = false;
				menuPage.removeReadyPlayer(playerID);
			} else if (menuPage.canAddReadyPlayer()){
				ready = true;
				menuPage.addReadyPlayer(playerID);
			}
		}
		sendMenuPage(menuPage.getMainMenu(ready, logged), "");
	});

	socket.on('login', function(state){
		console.log("login", state);
		var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
		if (format.test(state.name) || format.test(state.pass)) {
			socket.emit("err", {
				text: "name or password can not contain any special character!"
			});
		}
		else {
			playerID = DBConnection.getPlayerID(state.name, state.pass);
			if (playerID == undefined) {
				socket.emit("err", {
					text: "incorrect name or password!"
				});
			} else {
				logged = true;
				sendMenuPage(menuPage.getMainMenu(ready, logged), "");
			}
		}
	});

	socket.on('reg', function(state){
        console.log('reg');
	});

    socket.on('disconnect', function () {
        console.log('user disconnected');
	});
	
});



Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
}

function sendGameStateToAll(tag, main, sec){
	io.sockets.emit(tag, {
		world: main,
		gameInfo: sec
	});
}

function gameStarted(){
	let intervalTime = 50;
	setInterval(sendGameState, intervalTime);
}

function gameFinished(){
	clearInterval(sendGameState);
}

function sendGameState(){
	//console.log('sending changed state to all');
	if (gameState != undefined) 
		sendGameStateToAll('change', gameState.worldToAjax(), gameState.gameInfoToAjax());
}
