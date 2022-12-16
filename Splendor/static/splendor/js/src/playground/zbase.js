class SplendorPlayground {
    constructor(menu, config, players, room_id, me){
        this.menu = menu;
        this.config = config;
        this.players = players;
        this.me = me;
        this.room_id = room_id;
        this.mode = this.config['mode'];
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
    }

    init_canvas_context(){
        this.$canvas = $(`<canvas></canvas>`);
        this.$playground_div.append(this.$canvas);
        this.gl = this.$canvas[0].getContext('webgl');
        if(!this.gl){
            alert('未支持WebGl');
        }
        this.textureUtil = new TextureUtil(this);
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
        if(this.socket){
            this.socket.close();
            this.socket = null;
        }
        this.top_board.destroy();
        this.main_screen.destroy();
        this.bottom_board.destroy();

        this.$playground_div.remove();
    }
}
