class Player {

    constructor(id) {
        this.id = id;
        this.points = 0;
        this.timePacman = 0;
        this.x;
        this.y;
        this.moveSpeed;
        this.lastMove;
    }
}

module.exports = Player;