class SPGamePlayGround {
    constructor(root) {
        console.log("create new PlayGround");
        this.root = root;
        this.$sp_game_playground = $(`
<div>
    超级人类--单人模式
</div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_playground);
        this.start();
    }

    start(){};

    hide(){
        this.$sp_game_playground.hide();
    }

    show(){
        this.$sp_game_playground.show();
    }
}
