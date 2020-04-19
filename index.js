var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen (8886, function(){
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


let intervalTime = 50;
setInterval(sendGameState, intervalTime);

function sendGameState(){
	//console.log('sending changed state to all');
	if (gameState != undefined) io.sockets.emit('change', {
		world: gameState.worldToAjax(),
		gameInfo: gameState.gameInfoToAjax()
	});
}
