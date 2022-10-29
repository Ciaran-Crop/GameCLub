class SPGamePlayGround {
    constructor(root) {
        console.log("create new PlayGround");
        this.root = root;
        this.start();
    }

    create_single_mode(color, players_num, speed, radius){
        let player = new SPGamePlayer(this,Math.random() * this.width,Math.random() * this.height, color, speed, radius, true, false);
        this.players.push(player);
        for(let i = 0;i < players_num - 1;i++){
            let robot = new SPGamePlayer(this,Math.random() * this.width, Math.random() * this.height, this.colors[i%this.colors.length], speed, radius, false, true);
            this.players.push(robot);
        }
    }

    start(){
    };

    hide(){
        this.$sp_game_playground.hide();
    }

    show(){
        this.$sp_game_playground = $(`
    <div class="sp-game-playground"></div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_playground);
        this.width = this.$sp_game_playground.width();
        this.height = this.$sp_game_playground.height();
        this.sp_game_map = new SPGameMap(this);
        this.players = []
        // this.fireballs = []
        this.colors = ["Chocolate","Crimson","DarkGoldenRod","Gainsboro","Gold","NavajoWhite","Salmon","SlateGray"];
        this.create_single_mode("MidnightBlue",10,this.height * 0.25, this.height * 0.05);

        this.$sp_game_playground.show();
    }
}