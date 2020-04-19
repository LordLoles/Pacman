import Display from './Display.js';


class ServerConnection {

    constructor(){
        //this.socket = io.connect("http://localhost:8886");
        this.socket = io.connect("https://mutliplayer-pacman.herokuapp.com/");
        this.id;
        this.display = new Display();

        console.log("listening for changes");
        this.listenForChanges();
    }

    sendChange(event){
        this.send('change', event);
    }

    send(tag, event){
        this.socket.emit(tag, {
            change: event
        });
    }

    sendRequest(tag){
        this.send(tag, null);
    }

    listenForChanges(){
        var display = this.display;
        this.socket.on('change', function(state){
            display.displayWorld(state.world);
            display.displayGameInfo(state.gameInfo);
        });
    }

    requestID(){
        this.sendRecieve('id', null).then(msg => {
            this.id = msg;
            console.log('received id:', this.id);
            this.socket.removeAllListeners("id");
        });
    }
    
    sendRecieve(tag, data) {
        return new Promise((resolve, reject) => {
            //console.log("client sending message with tag " + tag);
            this.socket.emit(tag, data, function(response) {
                //console.log("got response ", response);
                resolve(response);
            });
        });
    }

}

export default ServerConnection;
