class Timer {

    constructor(seconds, functionAfter = this.id(), functionWithDecrease = this.id, text = "Time Left"){
        this.left = seconds;
        this.id = undefined;
        this.f = functionAfter;
        this.g = functionWithDecrease;
        this.text = text;
    }

    start(){
        this.id = setInterval(this.decrement, 1000, this);
    }

    stop(){
        clearInterval(this.id);
    }

    id(){ return; }

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

    toHTML(alternativeText = "Time left"){
        var text;
        if (alternativeText == "Time left") text = this.text;
        else text = alternativeText;
        
        return '<p>' + text + '</p>' +
            '<p>' + this.left + '</p><br>';
    }

    toDivHTML(text = "Time left"){
        return '<div class="timer">' + this.toHTML(text) + '</div>';
    }

}

module.exports = Timer;