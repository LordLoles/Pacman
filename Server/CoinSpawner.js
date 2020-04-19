class CoinSpawner {

    constructor(map, min, max) {
        this.map = map;
        this.spawning = true;
        this.min = min;    //minimun time in ms needed for coin to be spawned
        this.max = max;    //maximum time in ms needed for coin to be spawned

        this.initFillness = 0.3;

        this.initialSpawn();
        this.spawner();
    }

    initialSpawn(){
        var freeCoinPos = this.map.getFreeCoinPos();
        freeCoinPos.shuffle();
        freeCoinPos = freeCoinPos.slice(Math.floor((1 - this.initFillness) * freeCoinPos.length));
        for (let i = 0; i < freeCoinPos.length; i++){
            this.spawn(freeCoinPos[i]);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async spawner(){
        while(this.spawning){
            let timeToSleep = Math.floor(Math.random() * (this.max - this.min)) + this.min;
            //console.log("spawning with delay", timeToSleep);
            await this.sleep(timeToSleep);
            this.spawnCoin();
        }
    }

    spawnCoin(){
        var freeCoinPos = this.map.getFreeCoinPos();
        if (freeCoinPos.length != 0){
            let pos = Math.floor(Math.random() * freeCoinPos.length);
            this.spawn(freeCoinPos[pos]);
        }
    }

    spawn(a){
        this.map.field[a[0]][a[1]] = 7;
    }
}

module.exports = CoinSpawner;