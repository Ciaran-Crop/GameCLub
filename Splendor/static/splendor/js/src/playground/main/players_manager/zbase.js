class PlayersManager {
    constructor(playground) {
        this.playground = playground;
        this.am = this.playground.am;
        this.sm = this.playground.shader_manager;
        this.number = this.playground.player_number;
        this.players_config = [];
        this.players = [];
        this.roundi = -1;
        this.round = 0;
        this.start();
    }

    start() {
        for (let i in this.playground.players) {
            let p = this.playground.players[i];
            this.players_config.push({
                index: i,
                email: p.email,
                name: p.name,
                photo: p.photo,
                character: p.character,
                game_score: p.game_score,
                score: p.score,
            });
        }
        for (let i = 0; i < this.number; i++) {
            let p = new Player(this, this.players_config[i], i);
            if (this.players_config[i].character === 'me') this.me = p;
            this.players.push(p);
        }
    }

    get_me() {
        return this.me;
    }

    get_player(email) {
        for (let key in this.players) {
            let p = this.players[key];
            if (p.email === email) return p;
        }
    }

    is_me_round() {
        return this.roundi === this.get_me().getIndex();
    }

    clean(){
        for(let index in this.playground.cards_manager.cards.instance){
            let c = this.playground.cards_manager.cards.instance[index];
            if(c.clicked_state){
                this.playground.top_board.$click_card.find('.cancle').click();
            }
        }
    }

    next_player() {
        this.clean();
        if (this.roundi >= 0) this.playground.nobles_manager.can_get_one(this.players[this.roundi]);
        this.playground.top_board.clear_interval('tick');
        this.playground.top_board.$token_click.hide();
        this.playground.top_board.$click_card.hide();
        if (this.playground.tokens_manager.select_tokens.length > 0) this.playground.tokens_manager.unselect_by_player();
        if (this.playground.state === 'last_round') {
            if (this.roundi === this.number - 1) {
                this.playground.statistics(this.players);
            }
        }
        if (this.playground.state === 'round' || this.playground.state === 'last_round') {
            this.roundi = (this.roundi + 1) % this.number;
            let p = this.players[this.roundi];
            this.playground.top_board.add_tick(p);
            if (this.roundi === 0) this.round++;
            if (this.playground.state === 'round') {
                console.log('round ' + this.round + ' | now: ' + this.players[this.roundi].name);
            } else if (this.playground.state === 'last_round') {
                console.log('last round ' + ' | now: ' + this.players[this.roundi].name);
            }
        }
        this.am.play_func.tac();
    }
}