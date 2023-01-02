class SplendorPlayground {
    constructor(menu, config, players, room_id, me) {
        this.menu = menu;
        this.config = config;
        this.players = players;
        this.me = me;
        this.room_id = room_id;
        this.mode = this.config['single_mode'] || this.config['room_mode'];
        this.player_number = this.config['single_player_number'] || this.config['room_player_number'];
        this.round_second = this.config['room_round_second'] || this.config['single_round_second'];
        this.$playground_div = $(`<div class='playground'></div>`);
        this.menu.$menu_div.append(this.$playground_div);
        this.state = 'start'; // ['start', 'round', 'last_round', 'end']
        this.start();
    }

    start() {
        this.init_canvas_context();
        this.init_shader_manager();
        this.init_audio_manager();
        this.start_animation();
        if (this.mode !== '单人') {
            this.socket = new SplendorGameSocket(this);
            this.chat = new SplendorChat(this);
        }
        this.top_board = new TopBoard(this);
        this.cards_manager = new CardsManager(this);
        this.tokens_manager = new TokensManager(this);
        this.nobles_manager = new NoblesManager(this);
        this.players_manager = new PlayersManager(this);
        this.state = 'round';
        this.players_manager.next_player();
    }

    init_audio_manager(){
        this.am = new AudioManager(this);
    }

    init_canvas_context() {
        this.$canvas = $(`<canvas tabindex=1></canvas>`);
        this.$playground_div.append(this.$canvas);
        this.gl = this.$canvas[0].getContext('webgl');
        if (!this.gl) {
            alert('未支持WebGl');
        }
        this.$canvas.on('click', (e) => {
            this.process_mouse_event(e);
        });
        this.resize();
        $(window).resize(() => {
            this.resize();
        });
    }

    resize(){
        if(this.now_size) this.pre_size = this.now_size;
        else this.pre_size = [this.gl.canvas.clientWidth, this.gl.canvas.clientHeight];
        if(this.shader_manager)this.shader_manager.before_render();
        this.now_size = [this.gl.canvas.clientWidth, this.gl.canvas.clientHeight];
        for(let s = 0;s < GAME_OBJECTS.length;s++){
            let obj = GAME_OBJECTS[s];
            obj.update_offset();
        }
    }

    init_shader_manager() {
        this.shader_manager = new ShaderManager(this);
        this.shader_manager.init();
    }

    start_animation() {
        let GAME_ANIMATION = t => {
            this.shader_manager.before_render();
            for (let s = 0; s < GAME_OBJECTS.length; s++) {
                let obj = GAME_OBJECTS[s];
                if (!obj.is_called_start) {
                    obj.start();
                    obj.is_called_start = true;
                } else {
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

    statistics(players) {
        this.state = 'end';
        this.top_board.clear_interval();
        this.top_board.clear_interval('tick');
        let time = this.top_board.time;
        let min = Math.floor(time / 60);
        let sec = time % 60;
        if (sec < 10) sec = '0' + sec;
        if (min < 10) min = '0' + min;
        let last_time = min + ':' + sec;
        this.$statistics = $(`
<div class='statistics-wrap'>
    <div class='statistics-box'>
        <div class='statistics-title'>
            <span>结算统计</span>
            <span>对局时间 ${last_time}</span>
        </div>
        <div class='statistics-header'>
            <span>排名</span>
            <span>头像</span>
            <span>昵称</span>
            <span>游戏分数</span>
            <span>排位分数</span>
            <span>分数改变</span>
        </div>
        <div class='statistics-content'>

        </div>
        <div class='statistics-click'>
            <button>退出</button>
        </div>
    </div>
</div>        
`);
        this.players_stat = [];
        for (let i in players) {
            let p = players[i];
            this.players_stat.push({
                email: p.email,
                name: p.name,
                photo: p.photo,
                game_score: p.game_score,
                score: p.score,
            });
        }
        this.players_stat.sort((p1, p2) => {
            return p2.game_score - p1.game_score;
        });

        for (let i in this.players_stat) {
            let change_score = 0;
            if (this.mode !== '单人') {
                if (i === 1) change_score += 10;
                if (this.players_stat[i].game_score >= 15) change_score += 10;
                else change_score -= 10;
            }
            this.players_stat[i].score_change = change_score;
        }

        if(this.socket) this.socket.send_stat(this.players_stat);

        let content = this.$statistics.find('.statistics-content');
        for (let i in this.players_stat) {
            let rank = parseInt(i) + 1;
            let p = this.players_stat[i];
            let change_css = ((p.score_change < 0) ? 'statistics-change-red' : 'statistics-change-green');
            let change_score = (p.score_change < 0) ? p.score_change: '+' + p.score_change;
            let element = $(`
<div class='statistics-element'>
    <span>${rank}</span>
    <img src='${p.photo}'>
    <span>${p.name}</span>
    <span>${p.game_score}</span>
    <span>${p.score}</span>
    <span class='${change_css}'>${change_score}</span>
</div>
`);
            content.append(element);
        }
        this.$statistics.find('.statistics-click').on('click', () => {
            window.location.reload();
        });

        this.$playground_div.append(this.$statistics);
        return 0;
    }

    process_mouse_event(e) {
        if (!this.players_manager.is_me_round()) return false;
        if (this.state !== 'round' && this.state !== 'last_round') return false;
        let clientX = e.clientX;
        let clientY = e.clientY;
        let is_card = this.cards_manager.click_card(clientX, clientY);
        if (is_card !== null) {
            this.top_board.click_card(is_card);
            return true;
        }
        this.players_manager.clean();
        let is_token = this.tokens_manager.click_token(clientX, clientY);
        if (is_token !== null) {
            let result = this.tokens_manager.select_by_player(is_token);
            if (!result) {
                this.top_board.add_error_message('不能这样操作', clientX, clientY);
            }
        }
    }
}
