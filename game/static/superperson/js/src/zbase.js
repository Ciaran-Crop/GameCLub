export class SuperPersonGame {
    constructor(id, os){
        this.id = id;
        this.$sp_game_div = $('#' + id);
        this.os = os;
        this.login = new SPGameLogin(this);
        this.menu = new SPGameMenu(this);
        this.playground = new SPGamePlayGround(this);

        this.start();
    }

    start(){

    };
}

