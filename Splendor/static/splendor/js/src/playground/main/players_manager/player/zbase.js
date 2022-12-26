class Player extends GameObject {
    constructor(player_manager, player_config, i) {
        super();
        this.pm = player_manager;
        this.sm = this.pm.sm;
        this.character = player_config.character;
        this.email = player_config.email;
        this.name = player_config.name;
        this.game_score = player_config.game_score;
        this.score = player_config.score;
        this.tokens_count = 0;
        this.tokens = { G: 1, W: 2, B: 3, I: 2, R: 1, O: 1 };
        this.cards = { G: 0, W: 0, B: 0, I: 0, R: 0 };
        this.books = [];
        this.nobles = [];
        this.index = i;
        let y_step = 160;
        this.x = 1285;
        this.y = 77 + this.index * y_step;
    }

    update_tokens(color, num) {
        this.tokens[color] += num;
    }

    update_cards(color, num) {
        this.cards[color] += num;
    }

    update_books(color, op, card) {
        if(op === 'buy'){

        }else{
            
        }
    }

    update_nobles(noble) {
        if(this.nobles.length < 3) this.nobles.push(noble);
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
            this.sm.shader_gem(this.x + i * cards_x_step + x_step + 25, this.y + y_step - 5, gemi, {scale_x: 10, scale_y:10});
            if(count > 0){
                this.sm.shader_score(this.x + i * cards_x_step + x_step, this.y + y_step, Math.min(9, count - 1), {scale_x: 35, scale_y: 35});
            }
            i++;
        }
    }

    render_tokens() {
        let token_step = 37 + 5;
        let token_y_step = 50;
        let i = 0;
        for(let key in this.tokens){
            let tokeni = TokenColor2Index[key];
            let count = this.tokens[key];
            this.sm.shader_token(this.x + i * token_step + 5, this.y + token_y_step, tokeni, {scale_x: 35, scale_y: 35});
            if(count > 0) this.sm.shader_score(this.x + i * token_step + 5, this.y + token_y_step - 3, count - 1, {scale_x: 35, scale_y: 35});
            i++;
        }
    }

    render_books() {
        for(let i in this.books) this.books[i].update();
    }

    render_nobles() {
        for(let i in this.nobles) this.nobles[i].update();
    }

    render() {
        this.sm.shader_top_back(this.x, this.y, [0, 0, 0, 0.5], { scale_x: 260, scale_y: 150 });
        this.render_photo();
        this.render_cards();
        this.render_tokens();
        this.render_books();
        this.render_nobles();
    }

}