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
            G: { count: count, instance: [] },
            W: { count: count, instance: [] },
            B: { count: count, instance: [] },
            I: { count: count, instance: [] },
            R: { count: count, instance: [] },
            O: { count: 5, instance: [] },
        };
        this.offset_x = 970;
        this.offset_y = 100;
        this.y_step = 115;
        this.t_step = 5;
    }

    // move_to_select
    select_by_player(token_config) {
        // new Token
        // move to select region
    }

    unselect_by_player(tokens) {
        // move to token region
        // destroy token
    }

    // move_to_player
    picked_by_player(player, options) {
        // options has token_config, tokens
        // if token_config
        // new Token
        // move to player
        // else
        // move tokens to player
        // destroy
    }

    used_by_player(player, token_config) {
        // new Token
        // move to token region
        // destroy
    }

    move_to(tx, ty) {

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