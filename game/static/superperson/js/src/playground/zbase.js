class SPGamePlayGround {
    constructor(root) {
        this.root = root;
        this.$sp_game_playground = $(`
    <div class="sp-game-playground"></div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_playground);
        this.start();
    }

    create_single_mode(color, players_num, speed, radius){
        let player = new SPGamePlayer(this,Math.random() * this.width / this.scale,Math.random() * this.height / this.scale, color, speed, radius, true, false, this.root.login.photo, this.root.login.username);
        this.players.push(player);
        for(let i = 0;i < players_num - 1;i++){
            let robot = new SPGamePlayer(this,Math.random() * this.width / this.scale, Math.random() * this.height / this.scale, this.colors[i%this.colors.length], speed, radius, false, true);
            this.players.push(robot);
        }
    }

    create_multi_mode(color, players_nums, speed, radius){
        let outer = this;
        let x = Math.random() * this.width / this.scale;
        let y = Math.random() * this.height / this.scale;
        let player = new SPGamePlayer(this, x, y, color, speed, radius, true, false, this.root.login.photo, this.root.login.username);
        this.players.push(player);
        this.chat = new SPGameChatField(this);
        this.mps = new MultiPlayerSocket(this);
        this.mps.uuid = this.players[0].uuid;

        this.mps.ws.onopen = function(){
            outer.mps.send_create_player(x, y, outer.root.login.username, outer.root.login.photo, 'false');
        }
    }

    start(){
        let outer = this;
        $(window).resize(function(){
            outer.resize();
        });
    };

    hide(){
        while(this.players && this.players.length > 0){
            this.players[0].destroy();
        }

        if(this.sp_game_map){
            this.sp_game_map.destroy();
            this.sp_game_map = null;
        }

        if(this.sp_game_board){
            this.sp_game_board.destroy();
            this.sp_game_board = null;
        }

        if(this.sp_game_score_board){
            this.sp_game_score_board.destroy();
            this.sp_game_score_board = null;
        }

       this.$sp_game_playground.empty();


        this.$sp_game_playground.hide();
    }

    resize(){
        this.width = this.$sp_game_playground.width();
        this.height = this.$sp_game_playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if(this.sp_game_map) this.sp_game_map.resize();
    }
    show(mode){
        this.players = []
        this.sp_game_map = new SPGameMap(this);
        this.status = 'waiting' // waiting -> fighting -> over -> end
        this.sp_game_board = new SPGameBoard(this);
        this.sp_game_score_board = new SPGameScoreBoard(this);
        this.resize();
        this.colors = ["Chocolate","Crimson","DarkGoldenRod","Gainsboro","Gold","NavajoWhite","Salmon","SlateGray"];
        this.mode = mode;
        if(mode === 'single mode'){
            this.create_single_mode("MidnightBlue",3,0.25, 0.05);
        }else if(mode === 'multi mode'){
            this.create_multi_mode("MidnightBlue",3,0.25, 0.05);
        }

        this.$sp_game_playground.show();
    }

    get_me(){
        for(let i = 0;i < this.players.length;i++){
            if(this.players[i].is_who() === 'me'){
                return this.players[i];
            }
        }
        return null;
    }
}
