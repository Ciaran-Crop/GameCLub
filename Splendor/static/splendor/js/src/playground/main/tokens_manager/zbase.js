class TokensManager extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.sm = this.playground.shader_manager;
        let count = 0;
        switch (this.playground.player_number) {
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
        this.tokens = {
            G: { count: count, instance: [], offset: [970, 100] },
            W: { count: count, instance: [], offset: [970, 215] },
            B: { count: count, instance: [], offset: [970, 215 + 115] },
            I: { count: count, instance: [], offset: [970, 215 + 115 * 2] },
            R: { count: count, instance: [], offset: [970, 215 + 115 * 3] },
            O: { count: 5, instance: [], offset: [970, 215 + 115 * 4] },
        };
        this.select_tokens = [];
        this.offset_x = 970;
        this.offset_y = 100;
        this.y_step = 115;
        this.t_step = 5;
        this.width = 70;
        this.height = 70;
    }

    click_token(x, y) {
        for (let key in this.tokens) {
            let offset = this.tokens[key].offset;
            if (x >= offset[0] && y >= offset[1] && x <= offset[0] + this.width && y <= offset[1] + this.height) {
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
            token.move_to(900 + this.select_tokens.length * this.width, 5);
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

    update() {
        for (let key in this.tokens) {
            for (let i = 0; i < Math.min(3, this.tokens[key].count); i++) {
                this.tokens[key].instance[i].change_state('board');
            }
            for (let i = Math.min(3, this.tokens[key].count); i < 3; i++) {
                this.tokens[key].instance[i].change_state('unshow');
            }
        }
    }

    late_update() {
        let index = 0;
        let offset_x = this.offset_x;
        let offset_y = this.offset_y;
        let y_step = this.y_step;
        let t_step = 15;
        for (let key in this.tokens) {
            if (this.tokens[key].count > 0) {
                this.render(this.tokens[key].count, offset_x - t_step, offset_y + index * y_step - t_step);
            }
            index++;
        }
    }

    render(count, offset_x, offset_y) {
        this.sm.shader_score(offset_x, offset_y, count - 1, { scale_x: 40, scale_y: 40 });
    }
}