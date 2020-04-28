class MenuPage {

    getMenu(){
        return '' +
        '<div class="menu">' +

            '<div class="readyButton">' +
                '<button id="readybtn" type="button">READY!</button>' +
            '</div>' +

            '<div class="login">' +
                '<label for="lname">Nickname</label><br>' +
                '<input type="text" id="lname" name="lname" value="quest"><br><br>' +
                '<label for="lpass">Password</label><br>' +
                '<input type="password" id="lpass" name="lpass" value="123"><br><br>' +
                '<button id="loginbtn" type="button">Log In</button><br>' +
                '<button id="regbtn" type="button">Register</button>' +
            '</div>' +

            '<div class="stats">' +
                '' +
            '</div>' +

        '</div>';
    }
}

module.exports = MenuPage;
