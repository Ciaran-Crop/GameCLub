class Player extends GameObject {
    constructor(player_manager, player_config, i) {
        super();
        this.pm = player_manager;
        this.sm = this.pm.sm;
        this.character = player_config.character;
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
        let y_step = 160;
        this.x = 1285;
        this.y = 77 + this.index * y_step;
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
        console.log(this.game_score);
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
        let x_step = 5;
        let card_step = 45;
        if (op === 'buy') {
            this.update_cards(card, card.card_config.gem, 1);
            for (let i in this.books) {
                if (this.books[i] === card) this.books.splice(i, 1);
            }
            card.destroy();
            for(let i in this.books){
                this.books[i].move_to(this.x +
                    x_step * (parseInt(i) + 1) +
                    card_step * parseInt(i), this.y + 90);
            }
        } else {
            card.change_state('book');
            card.move_to(this.x +
                x_step * (this.books.length + 1) +
                card_step * this.books.length, this.y + 90);
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

    update() {
        this.render();
    }

    render_photo() {
        let x_step = 10;
        let y_step = 10;
        this.sm.shader_player_photo(this.email, this.x + x_step, this.y + y_step);
    }

    render_cards() {
        let x_step = 10;
        let y_step = 10;
        let cards_x_step = 10 + 25;
        let i = 1;
        for (let key in this.cards) {
            let cardi = NSColor2Index[key];
            let gemi = GemColor2Index[key];
            let count = this.cards[key];
            this.sm.shader_mini_card_back(this.x + i * cards_x_step + x_step, this.y + y_step, cardi);
            this.sm.shader_gem(this.x + i * cards_x_step + x_step + 25, this.y + y_step - 5, gemi, { scale_x: 10, scale_y: 10 });
            if (count > 0) {
                this.sm.shader_score(this.x + i * cards_x_step + x_step, this.y + y_step, Math.min(9, count - 1), { scale_x: 35, scale_y: 35 });
            }
            i++;
        }
    }

    render_tokens() {
        let token_step = 37 + 5;
        let token_y_step = 50;
        let i = 0;
        for (let key in this.tokens) {
            let tokeni = TokenColor2Index[key];
            let count = this.tokens[key];
            this.sm.shader_token(this.x + i * token_step + 5, this.y + token_y_step, tokeni, { scale_x: 35, scale_y: 35 });
            if (count > 0) this.sm.shader_score(this.x + i * token_step + 5, this.y + token_y_step - 3, count - 1, { scale_x: 35, scale_y: 35 });
            i++;
        }
    }

    render_nobles() {
        if (this.nobles.length > 0) this.sm.shader_score(this.x + 45 * 3 + 5 * 4, this.y + 100, this.nobles.length - 1, { scale_x: 40, scale_y: 40 });
    }

    render() {
        this.sm.shader_top_back(this.x, this.y, [0, 0, 0, 0.5], { scale_x: 260, scale_y: 150 });
        this.render_photo();
        this.render_cards();
        this.render_tokens();
        this.render_nobles();
    }

}