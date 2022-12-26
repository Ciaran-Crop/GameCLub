class SplendorPlayground {
    constructor(menu, config, players, room_id, me){
        this.menu = menu;
        this.config = config;
        this.players = players;
        this.me = me;
        this.room_id = room_id;
        this.mode = this.config['single_mode'] || this.config['room_mode'];
        this.player_number = this.config['single_player_number'] || this.config['room_player_number'];
        this.round_second = this.config['room_round_second'] || 30;
        this.$playground_div = $(`<div class='playground'></div>`);
        this.menu.$menu_div.append(this.$playground_div);
        this.state = 'start'; // ['start', 'round', 'last_round', 'end']
        this.start();
    }

    start(){
        this.init_canvas_context();
        this.init_shader_manager();
        this.start_animation();
        if(this.mode !== '单人'){
            this.socket = new SplendorGameSocket(this);
            this.chat = new SplendorChat(this);
        }
        this.top_board = new TopBoard(this);
        this.cards_manager = new CardsManager(this);
        this.tokens_manager = new TokensManager(this);
        this.nobles_manager = new NoblesManager(this);
        this.players_manager = new PlayersManager(this);
        // this.top_manager = new 
        // this.time_manager = new 
    }

    init_canvas_context(){
        this.$canvas = $(`<canvas></canvas>`);
        this.$playground_div.append(this.$canvas);
        this.gl = this.$canvas[0].getContext('webgl');
        if(!this.gl){
            alert('未支持WebGl');
        }
    }

    init_shader_manager(){
        this.shader_manager = new ShaderManager(this);
        this.shader_manager.init();
    }

    start_animation(){
        let GAME_ANIMATION = t =>  {
            this.shader_manager.before_render();
            for (let s = 0; s < GAME_OBJECTS.length; s++) {
                let obj = GAME_OBJECTS[s];
                if(!obj.is_called_start){
                    obj.start();
                    obj.is_called_start = true;
                }else{
                    obj.update();
                    obj.timedelta = t - last_timestamp;
                }
            }
            for (let t = 0; t < GAME_OBJECTS.length; t++) {
                GAME_OBJECTS[t].late_update();
            }
            last_timestamp = t;
            requestAnimationFrame(GAME_ANIMATION);
        };
        requestAnimationFrame(GAME_ANIMATION);
    }

    close(){
    }
}
