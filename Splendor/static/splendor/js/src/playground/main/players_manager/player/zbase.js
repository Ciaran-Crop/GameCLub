class Player extends GameObject {
    constructor(player_manager, player_config, i) {
        super();
        this.pm = player_manager;
        this.sm = this.pm.sm;
        this.character = player_config.character;
        this.gl = this.pm.gl;
        this.email = player_config.email;
        this.name = player_config.name;
        this.game_score = player_config.game_score;
        // this.game_score = 15;
        this.score = player_config.score;
        this.photo = player_config.photo;
        this.tokens_count = 0;
        this.tokens = { G: 0, W: 0, B: 0, I: 0, R: 0, O: 0 };
        this.cards = { G: 0, W: 0, B: 0, I: 0, R: 0 };
        this.books = [];
        this.nobles = [];
        this.index = i;
        const gl = this.gl;
        let y_step = fix(gl, player_y_step, false);
        this.x = fix(gl, player_x, true);
        this.y = fix(gl, player_y, false) + this.index * y_step;
    }

    do() {
        let playground = this.pm.playground;

        // buy
        for (let i in playground.cards_manager.cards.instance) {
            let card = playground.cards_manager.cards.instance[i];
            if ((card.state === 'book' && card.role === this.email) || card.state === 'board') {
                if (card.can_buy(this)) {
                    card.buy_by_player(this, false);
                    return;
                }
            }
        }

        // token
        for (let key in playground.tokens_manager.tokens) {
            if (key === 'O') break;
            let count = playground.tokens_manager.tokens[key].count;
            if (count >= 4 && this.tokens_count <= 8) {
                let pick = {};
                pick[key] = 2;
                playground.tokens_manager.picked_by_player_from_tokens(this, pick);
                this.pm.next_player();
                return;
            }
        }
        let can_pick = Math.min(3, 10 - this.tokens_count);
        let pick = {};
        for (let key in playground.tokens_manager.tokens) {
            if (key === 'O') break;
            let count = playground.tokens_manager.tokens[key].count;
            if (count > 0 && can_pick > 0) {
                pick[key] = 1;
                can_pick--;
            }
            if (!can_pick) break;
        }
        if (!$.isEmptyObject(pick)) {
            playground.tokens_manager.picked_by_player_from_tokens(this, pick);
            this.pm.next_player();
            return;
        }

        // book 
        for (let i in playground.cards_manager.cards.instance) {
            let card = playground.cards_manager.cards.instance[i];
            if (card.state === 'board') {
                if (card.can_book(this)) {
                    card.book_by_player(this, false);
                    return;
                }
            }
        }
        this.pass(true);
        return;
    }

    add_pass_count() {
        this.pass_count++;
        if (this.pass_count >= 3) this.state = 'offline';
    }

    pass(receive = false) {
        if (!receive) {
            if (this.pm.playground.socket) this.pm.playground.socket.send_pass(this.email);
        }
        this.pm.next_player();
    }

    getIndex() {
        return this.index;
    }

    update_score(score) {
        let playground = this.pm.playground;
        this.game_score += score;
        playground.top_board.change_game_score(this, this.game_score);
        if (this.game_score >= 15) {
            if (playground.state === 'round') playground.state = 'last_round';
        }

    }

    update_tokens(color, num) {
        this.tokens[color] += num;
        this.tokens_count += num;
    }

    update_cards(card, color, num) {
        this.cards[color] += num;
        this.update_score(card.card_config.score);
    }

    update_books(op, card) {
        const gl = this.gl;
        let x_step = fix(gl, player_book_x_step, true);
        let card_step = fix(gl, player_book_card_step, true);
        let y_fix_step = fix(gl, player_book_y_fix_step, false);
        if (op === 'buy') {
            this.update_cards(card, card.card_config.gem, 1);
            for (let i in this.books) {
                if (this.books[i] === card) this.books.splice(i, 1);
            }
            card.destroy();
            for (let i in this.books) {
                this.books[i].move_to(this.x +
                    x_step * (parseInt(i) + 1) +
                    card_step * parseInt(i), this.y + y_fix_step);
            }
        } else {
            card.change_state('book');
            card.move_to(this.x +
                x_step * (this.books.length + 1) +
                card_step * this.books.length, this.y + y_fix_step);
            card.change_scale(0.3);
            card.role = this.email;
            this.books.push(card);
        }

    }

    can_get_one() {
        if (this.nobles.length >= 3) return false;
        return true;
    }

    update_nobles(noble) {
        if (this.nobles.length < 3) {
            this.nobles.push(noble);
            this.update_score(noble.noble_config.score);
        }
    }

    update_offset(){
        const gl = this.gl;
        let y_step = fix(gl, player_y_step, false);
        this.x = fix(gl, player_x, true);
        this.y = fix(gl, player_y, false) + this.index * y_step;
    }

    update() {
        this.render();
    }

    late_update(){
        this.render_nobles();
    }

    render_photo() {
        const gl = this.gl;
        let x_step = fix(gl, player_photo_x_step, true);
        let y_step = fix(gl, player_photo_y_step, false);
        this.sm.shader_player_photo(this.email, this.x + x_step, this.y + y_step);
    }

    render_cards() {
        const gl = this.gl;
        let x_step = fix(gl, player_card_x_step, true);
        let y_step = fix(gl, player_card_y_step, false);
        let cards_x_step = fix(gl, player_card_card_x_step, true);
        let fix_x_step = fix(gl, player_card_fix_x_step, true);
        let fix_y_step = fix(gl, player_card_fix_y_step, false);
        let i = 1;
        for (let key in this.cards) {
            let cardi = NSColor2Index[key];
            let gemi = GemColor2Index[key];
            let count = this.cards[key];
            this.sm.shader_mini_card_back(this.x + i * cards_x_step + x_step, this.y + y_step, cardi);
            this.sm.shader_gem(this.x + i * cards_x_step + x_step + fix_x_step, this.y + y_step - fix_y_step, gemi, { scale_x: fix(gl, player_card_gem_scale_x, true), scale_y: fix(gl, player_card_gem_scale_y, false) });
            if (count > 0) {
                this.sm.shader_score(this.x + i * cards_x_step + x_step, this.y + y_step, Math.min(9, count - 1), { scale_x: fix(gl, player_card_score_scale_x, true), scale_y: fix(gl, player_card_score_scale_y, false) });
            }
            i++;
        }
    }

    render_tokens() {
        const gl = this.gl;
        let token_step = fix(gl, player_token_x_step, true);
        let token_y_step = fix(gl, player_token_y_step, false);
        let token_fix_x_step = fix(gl, player_token_x_fix_step, true);
        let token_fix_y_step = fix(gl, player_token_y_fix_step, false);
        let i = 0;
        for (let key in this.tokens) {
            let tokeni = TokenColor2Index[key];
            let count = this.tokens[key];
            this.sm.shader_token(this.x + i * token_step + token_fix_x_step, this.y + token_y_step, tokeni, { scale_x: fix(gl, player_card_score_scale_x, true), scale_y: fix(gl, player_card_score_scale_y, false) });
            if (count > 0) this.sm.shader_score(this.x + i * token_step + token_fix_x_step, this.y + token_y_step - token_fix_y_step, count - 1, { scale_x: fix(gl, player_card_score_scale_x, true), scale_y: fix(gl, player_card_score_scale_y, false)});
            i++;
        }
    }

    render_nobles() {
        const gl = this.gl;
        let x_step = fix(gl, player_noble_x_step, true);
        let y_step = fix(gl, player_noble_y_step, false);
        if (this.nobles.length > 0) this.sm.shader_score(this.x + x_step, this.y + y_step, this.nobles.length - 1, { scale_x: fix(gl, player_noble_scale_x, true), scale_y: fix(gl, player_noble_scale_y, false) });
    }

    render() {
        const gl = this.gl;
        this.sm.shader_top_back(this.x, this.y, [0, 0, 0, 0.5], { scale_x: fix(gl, player_top_back_x, true), scale_y: fix(gl, player_top_back_y, false) });
        this.render_photo();
        this.render_cards();
        this.render_tokens();
    }

}