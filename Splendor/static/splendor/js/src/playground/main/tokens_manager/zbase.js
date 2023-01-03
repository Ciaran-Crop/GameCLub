class TokensManager extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.sm = this.playground.shader_manager;
        this.am = this.playground.am;
        this.gl = this.playground.gl;
        let count = 0;
        switch (this.playground.players_manager.number) {
            case 1:
                count = 4;
                break;
            case 2:
                count = 4;
                break;
            case 3:
                count = 5;
                break;
            default:
                count = 7;
                break;
        }
        const gl = this.gl;
        this.tokens = {
            G: { count: count, instance: [], offset: [fix(gl, token_offset_x, true), fix(gl, token_offset_y + token_offset_y_step * 0, false)] },
            W: { count: count, instance: [], offset: [fix(gl, token_offset_x, true), fix(gl, token_offset_y + token_offset_y_step * 1, false)] },
            B: { count: count, instance: [], offset: [fix(gl, token_offset_x, true), fix(gl, token_offset_y + token_offset_y_step * 2, false)] },
            I: { count: count, instance: [], offset: [fix(gl, token_offset_x, true), fix(gl, token_offset_y + token_offset_y_step * 3, false)] },
            R: { count: count, instance: [], offset: [fix(gl, token_offset_x, true), fix(gl, token_offset_y + token_offset_y_step * 4, false)] },
            O: { count: 5, instance: [], offset: [fix(gl, token_offset_x, true), fix(gl, token_offset_y + token_offset_y_step * 5, false)] },
        };
        this.select_tokens = [];
        this.offset_x = fix(gl, token_offset_x, true);
        this.offset_y = fix(gl, token_offset_y, false);
        this.y_step = fix(gl, token_offset_y_step, false);
        this.t_step = fix(gl, token_offset_y_t_step, false);
        this.width = fix(gl, token_width, true);
        this.height = fix(gl, token_height, true);
    }

    update_offset(){
        const gl = this.gl;
        this.offset_x = fix(gl, token_offset_x, true);
        this.offset_y = fix(gl, token_offset_y, false);
        this.y_step = fix(gl, token_offset_y_step, false);
        this.t_step = fix(gl, token_offset_y_t_step, false);
        this.width = fix(gl, token_width, true);
        this.height = fix(gl, token_height, true);
        let i = 0;
        for(let index in this.tokens){
            let obj = this.tokens[index];
            obj.offset = [fix(gl, token_offset_x, true), fix(gl, token_offset_y + token_offset_y_step * i, false)]
            i++;
        }
    }

    click_token(x, y) {
        const gl = this.gl;
        let t_x_step = fix(gl, token_score_t_step_x, true);
        let t_y_step = fix(gl, token_score_t_step_y, false);
        for (let key in this.tokens) {
            let offset = this.tokens[key].offset;
            let x1 = offset[0] - t_x_step;
            let y1 = offset[1] - t_y_step;
            let x2 = x1 + this.width;
            let y2 = y1 + this.height;
            if (x >= x1 && y >= y1 && x <= x2 && y <= y2) {
                if (key === 'O') return null;
                if (this.tokens[key].count <= 0) return null;
                if (this.playground.players_manager.get_me().tokens_count >= 10) return null;
                return key;
            }
        }
        return null;
    }

    // move_to_select
    select_by_player(token_config) {
        const gl = this.gl;
        if (this.select_tokens.length === 0 && this.tokens[token_config].count > 0) {
            this.playground.top_board.add_token_click();
        } else if (this.select_tokens.length === 1) {
            if (this.select_tokens[0].color === token_config && this.tokens[token_config].count < 3) {
                return false;
            }
        } else if (this.select_tokens.length === 2) {
            if (this.select_tokens[0].color === this.select_tokens[1].color) return false;
            for (let i in this.select_tokens) {
                if (this.select_tokens[i].color === token_config) return false;
            }
        } else if (this.select_tokens.length === 3) {
            return false;
        }
        if (this.select_tokens.length + this.playground.players_manager.get_me().tokens_count + 1 > 10) {
            return false;
        }
        if (this.tokens[token_config].count > 0) {
            this.tokens[token_config].count--;
            let offset = this.tokens[token_config].offset;
            let token = new Token(this, token_config, offset[0], offset[1]);
            this.select_tokens.push(token);
            token.move_to(fix(gl, token_move_length, true) + this.select_tokens.length * this.width, fix(gl, token_dis_top, false));
            this.am.play_func.select_token();
            return true;
        } else {
            return false;
        }
    }

    unselect_by_player() {
        for (let i in this.select_tokens) {
            let offset = this.tokens[this.select_tokens[i].color].offset;
            this.tokens[this.select_tokens[i].color].count++;
            this.select_tokens[i].move_to(offset[0], offset[1]);
        }
        for (let i in this.select_tokens) {
            this.select_tokens[i].change_state('on_de');
        }
        this.am.play_func.get_use_token();
        this.select_tokens = [];
    }

    // move_to_player
    picked_by_player_from_tokens(player, token_config) {
        for(let key in token_config){
            if(this.tokens[key].count >= token_config[key]){
                this.tokens[key].count -= token_config[key];
                let offset = this.tokens[key].offset;
                for(let i = 0;i < token_config[key];i++){
                    let token = new Token(this, key, offset[0], offset[1]);
                    token.move_to(player.x, player.y);
                    token.change_state('on_de');
                    player.update_tokens(key, 1);
                }
            }
        }
        this.am.play_func.get_use_token();
    }

    picked_by_me() {
        let p = this.playground.players_manager.get_me();
        let tokens_config = {};
        for (let i in this.select_tokens) {
            this.select_tokens[i].move_to(p.x, p.y);
            p.update_tokens(this.select_tokens[i].color, 1);
            if(tokens_config[this.select_tokens[i].color]) tokens_config[this.select_tokens[i].color]++;
            else tokens_config[this.select_tokens[i].color] = 1;
            this.select_tokens[i].change_state('on_de');
        }
        this.select_tokens = [];
        if(this.playground.socket) this.playground.socket.send_get_tokens(p.email, tokens_config);
        this.am.play_func.get_use_token();
        this.playground.players_manager.next_player();
    }

    used_by_player(player, token_config) {
        for(let key in token_config){
            let need = token_config[key];
            player.update_tokens(key, -need);
            for(let i = 0;i < need;i++){
                let offset = this.tokens[key].offset;
                let token = new Token(this, key, player.x, player.y);
                token.move_to(offset[0], offset[1]);
                token.change_state('on_de');
                this.tokens[key].count++;
            }
        }
        this.am.play_func.get_use_token();
    }

    start() {
        let index = 0;
        let offset_x = this.offset_x;
        let offset_y = this.offset_y;
        let y_step = this.y_step;
        let t_step = this.t_step;
        for (let key in this.tokens) {
            for (let i = 0; i < 3; i++) {
                this.tokens[key].instance.push(new Token(this, key, offset_x, offset_y + index * y_step - t_step * i));
            }
            index++;
        }
    }

    update_token_state(){
        for (let key in this.tokens) {
            for (let i = 0; i < Math.min(3, this.tokens[key].count); i++) {
                this.tokens[key].instance[i].change_state('board');
            }
            for (let i = Math.min(3, this.tokens[key].count); i < 3; i++) {
                this.tokens[key].instance[i].change_state('unshow');
            }
        }
    }


    update() {
        this.update_token_state();
    }

    late_update() {
        let index = 0;
        const gl = this.gl;
        let offset_x = this.offset_x;
        let offset_y = this.offset_y;
        let y_step = this.y_step;
        let t_x_step = fix(gl, token_score_t_step_x, true);
        let t_y_step = fix(gl, token_score_t_step_y, false);
        for (let key in this.tokens) {
            if (this.tokens[key].count > 0) {
                this.render(this.tokens[key].count, offset_x - t_x_step, offset_y + index * y_step - t_y_step);
            }
            index++;
        }
    }

    render(count, offset_x, offset_y) {
        const gl = this.gl;
        this.sm.shader_score(offset_x, offset_y, count - 1, { scale_x: fix(gl, token_score_scale_x, true), scale_y: fix(gl, token_score_scale_y, false) });
    }
}