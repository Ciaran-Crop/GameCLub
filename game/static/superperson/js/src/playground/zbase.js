class SPGamePlayGround {
    constructor(root) {
        console.log("create new PlayGround");
        this.root = root;
        this.$sp_game_playground = $(`
    <div class="sp-game-playground"></div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_playground);
        this.start();
    }

    create_single_mode(color, players_num, speed, radius){
        let player = new SPGamePlayer(this,Math.random() * this.width / this.scale,Math.random() * this.height / this.scale, color, speed, radius, true, false);
        this.players.push(player);
        for(let i = 0;i < players_num - 1;i++){
            let robot = new SPGamePlayer(this,Math.random() * this.width / this.scale, Math.random() * this.height / this.scale, this.colors[i%this.colors.length], speed, radius, false, true);
            this.players.push(robot);
        }
    }

    start(){
        let outer = this;
        $(window).resize(function(){
            outer.resize();
        });
    };

    hide(){
        this.$sp_game_playground.hide();
    }

    resize(){
        this.width = this.$sp_game_playground.width();
        this.height = this.$sp_game_playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        console.log("scale: ", this.scale);
        if(this.sp_game_map) this.sp_game_map.resize();
    }
    show(){
        this.resize();
        this.sp_game_map = new SPGameMap(this);
        this.players = []
        // this.fireballs = []
        this.colors = ["Chocolate","Crimson","DarkGoldenRod","Gainsboro","Gold","NavajoWhite","Salmon","SlateGray"];
        this.create_single_mode("MidnightBlue",10,0.25, 0.05);

        this.$sp_game_playground.show();
    }
}
