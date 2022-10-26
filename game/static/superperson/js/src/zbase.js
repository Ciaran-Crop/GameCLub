class SuperPersonGame {
    constructor(id){
        console.log("create new SuperPersonGame");
        this.id = id;
        this.$sp_game_div = $('#' + id);
        this.menu = new SPGameMenu(this);
        this.playground = new SPGamePlayGround(this);

        this.start();
    }

    start(){

    };
}

