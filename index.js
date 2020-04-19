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

var playerID = 0;

let gameState;

io.on('connection', function(socket){
	console.log("made socket connecton");

	
	socket.on('id', function(event, ackCallback){
		console.log('recieved id request');
		socket.playerID = playerID;
		console.log('sending id ' + socket.playerID);
		//socket.emit('id', {id: playerID});
		ackCallback(playerID);
		playerID++;
		gameState = new (require('./Server/GameState.js'))(playerID);
	});

	socket.on('change', function(event){
		//console.log("command " + event.change + " from player " + socket.playerID);
		gameState.move(socket.playerID, event.change);
	});
});

Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
}


let intervalTime = 50;
setInterval(sendGameState, intervalTime);

function sendGameState(){
	//console.log('sending changed state to all');
	if (gameState != undefined) io.sockets.emit('change', {
		world: gameState.worldToAjax(),
		gameInfo: gameState.gameInfoToAjax()
	});
}
