export class SuperPersonGame {
    constructor(id, os, access, refresh){
        this.id = id;
        this.$sp_game_div = $('#' + id);
        this.os = os;
        if(!localStorage.getItem(`superperson-access`)){
            localStorage.setItem(`superperson-access`, access);
        }
        if(!localStorage.getItem(`superperson-refresh`)){
            localStorage.setItem(`superperson-refresh`, refresh);
        }
        this.login = new SPGameLogin(this);
        this.menu = new SPGameMenu(this);
        this.playground = new SPGamePlayGround(this);

        this.start();
    }

    start(){

    };
}

