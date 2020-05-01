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
var menuPage = new (require('./Server/MenuPage.js'))(require('./Server/Timer.js'), preparationStarted);
var DBConnection = new (require('./Server/DBConnection.js'))();

var connected = {};

let gameState;

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
		//gameState = new (require('./Server/GameState.js'))(playerID);
	});

	socket.on('change', function(event){
		//console.log("command " + event.change + " from player " + socket.playerID);
		gameState.move(socket.playerID, event.change);
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

function sendMenuPageToAll(){
	Object.values(connected).forEach(e => {
		e.socket.emit("menu", {
			main: menuPage.getMainMenu(e.ready, e.logged)
		});
	});
}

function menuStarted(){
	setInterval(sendMenuPageToAll, 1000);
}


TODO
function preparationStarted(){
	console.log("hiiiir");
}

var sendGameStateID;
function gameStarted(){
	let intervalTime = 50;
	sendGameStateID = setInterval(sendGameState, intervalTime);
}

function gameFinished(){
	clearInterval(sendGameStateID);
}

function sendGameState(){
	//console.log('sending changed state to all');
	if (gameState != undefined) 
		sendGameStateToAll('change', gameState.worldToAjax(), gameState.gameInfoToAjax());
}
