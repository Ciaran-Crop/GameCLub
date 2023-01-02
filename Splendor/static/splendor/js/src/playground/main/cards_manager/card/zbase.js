class Card extends GameObject {
    constructor(cards_manager, card, x, y, level, location) {
        super();
        this.playground = cards_manager.playground;
        this.cm = cards_manager;
        this.sm = this.cm.sm;
        this.am = this.cm.playground.am;
        this.card_config = card;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.speed = 1000;
        this.state = 'board'; // 'board', 'book', 'on_de'
        this.clicked_state = false;
        this.role = null;
        this.level = level;
        this.location = location;
        this.scale = 1;
        this.uuid = this.card_config.id;
        this.change_speed = 1.5;
        this.scale_change_flag = 1;
        this.scale_change = 0;
    }

    can_buy(player) {
        let spend = this.card_config.spend;
        let less_count = 0;
        for (let i in spend) {
            let e = spend[i];
            let color = e.color;
            let need = e.need;
            less_count += Math.max(0, need - player.cards[color] - player.tokens[color]);
        }
        if (less_count - player.tokens.O <= 0) return true;
        else return false;
    }

    buy_by_player(player, send = true) {
        let spend = this.card_config.spend;
        let need_token = {};
        let less_count = 0;
        for (let i in spend) {
            let e = spend[i];
            let color = e.color;
            let need = e.need;
            need_token[color] = Math.max(0, need - player.cards[color]);
            if(need_token[color] - player.tokens[color] > 0){
                less_count += (need_token[color] - player.tokens[color]);
                need_token[color] = 0;
            }
        }
        need_token.O = less_count;
        if(player.email === this.playground.players_manager.get_me().email && send){
            if(this.playground.socket) this.playground.socket.send_buy_card(player.email, this.uuid);
        }
        this.playground.tokens_manager.used_by_player(player, need_token);
        if (this.state === 'book') player.update_books('buy', this);
        else {
            this.change_scale(0.3);
            this.move_to(player.x, player.y);
            this.change_state('on_de');
            player.update_cards(this, this.card_config.gem, 1);
            this.playground.cards_manager.next_card(this.level, this.location);
        }
        this.am.play_func.splendor_ping();
        this.playground.players_manager.next_player();
    }

    can_book(player) {
        if (this.state === 'board') {
            if (player.books.length < 3) return true;
        }
        else return false;
    }

    book_by_player(player, send = true) {
        if (player.tokens_count + 1 <= 10) {
            this.playground.tokens_manager.picked_by_player_from_tokens(player, { O: 1 });
        }
        if(player.email === this.playground.players_manager.get_me().email && send){
            if(this.playground.socket) this.playground.socket.send_book_card(player.email, this.uuid);
        }
        player.update_books('book', this);
        this.playground.cards_manager.next_card(this.level, this.location);
        this.am.play_func.splendor_ping();
        this.playground.players_manager.next_player();
    }

    clicked(x, y) {
        if (this.state !== 'board' && this.state !== 'book') {
            return false;
        }
        if (this.state === 'book') {
            if (this.role !== this.playground.players_manager.get_me().email) return false;
        }
        let width = 150 * this.scale;
        let height = 203 * this.scale;
        if (x >= this.x && x <= this.x + width && y >= this.y && y <= this.y + height && (this.role === null || this.role === this.playground.me.email)) {
            this.clicked_state = true;
            return true;
        } else {
            return false;
        }
    }

    change_state(state) {
        this.state = state;
    }

    change_scale(scale) {
        this.scale_change_flag = scale > this.scale ? 1 : -1;
        this.scale_change = Math.abs(scale - this.scale);
    }

    change_big(){
        if(this.state === 'book'){
            this.change_scale(0.6);
            return 0.6;
        }else{
            this.change_scale(1.1);
            return 1.1;
        }
    }
    
    change_back(){
        if(this.state === 'book'){
            this.change_scale(0.3);
        }else{
            this.change_scale(1);
        }
        this.clicked_state = false;
    }

    get_dist(x1, y1, x2, y2) {
        let dx = (x2 - x1) * (x2 - x1);
        let dy = (y2 - y1) * (y2 - y1);
        return Math.sqrt(dx + dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(tx, ty, this.x, this.y);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        this.am.play_func.move();
    }

    update_x_y() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta * 0.001);
        this.move_length -= moved;
        this.x += moved * this.vx;
        this.y += moved * this.vy;
    }

    update_scale(){
        let changed = Math.min(this.scale_change, this.change_speed * this.timedelta * 0.001);
        this.scale_change -= changed;
        this.scale += this.scale_change_flag * changed;
    }

    start() {

    }

    update() {
        if (this.state === 'on_de') {
            if (this.move_length === 0) this.destroy();
        }
        this.update_x_y();
        this.update_scale();
        this.render();
    }

    late_update(){
        if(this.clicked_state){
            this.update_x_y();
            this.update_scale();
            this.render();
        }
    }

    on_destroy() {
        for (let i in this.cm.cards.instance) {
            if (this.cm.cards.instance[i] === this) {
                this.cm.cards.instance.splice(i, 1);
            }
        }
    }

    render() {
        let gem_step = 98 * this.scale;
        let spend_step = 100 * this.scale;
        let spend_index = [2, 0, 3, 1];
        let gem_step_x = 40 * this.scale;
        let gem_step_y = 15 * this.scale;
        let scale = this.scale;
        let fix_step = 50 * this.scale;
        this.sm.shader_card_back(this.x, this.y, this.card_config.backIndex[0], this.card_config.backIndex[1], { scale: scale });
        this.sm.shader_top_back(this.x, this.y, [1, 1, 1, 0.5], { scale: scale });
        this.sm.shader_score(this.x, this.y, this.card_config.score - 1, { scale: scale });
        this.sm.shader_gem(this.x + gem_step, this.y, GemColor2Index[this.card_config.gem], { scale: scale });
        this.card_config.spend.forEach((value, index) => {
            index = spend_index[index];
            let iy = Math.floor(index / 2);
            let ix = index % 2;
            let backi = NSColor2Index[value.color];
            let needi = value.need - 1;
            this.sm.shader_spend(this.x + ix * fix_step, this.y + spend_step + iy * fix_step, backi, needi, { scale: scale });
        });
        this.card_config.spend.forEach((value, index) => {
            index = spend_index[index];
            let iy = Math.floor(index / 2);
            let ix = index % 2;
            let gemi = GemColor2Index[value.color];
            this.sm.shader_gem(this.x + ix * fix_step + gem_step_x, this.y + iy * fix_step + gem_step_y + spend_step, gemi, { scale_x: 20, scale_y: 20, scale: scale });
        });
    }
}