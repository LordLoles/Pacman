class Timer {

    constructor(seconds, functionAfter, functionWithDecrease = this.id){
        this.left = seconds;
        this.id = undefined;
        this.f = functionAfter;
        this.g = functionWithDecrease;
    }

    start(){
        this.id = setInterval(this.decrement, 1000, this);
    }

    stop(){
        clearInterval(this.id);
    }

    id(){}

    // static-like function
    decrement(timer){
        if (timer.ended()) {
            timer.stop();
            timer.f();
            return;
        }
        timer.left--;
        timer.g();
    }

    ended(){
        return this.left == 0;
    }

    toHTML(){
        return '<p>Time left</p>' +
            '<p>' + this.left + '</p><br>';
    }

}

module.exports = Timer;