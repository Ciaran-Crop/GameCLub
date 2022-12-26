class Card extends GameObject {
    constructor(cards_manager, card, x, y) {
        super();
        this.cm = cards_manager;
        this.sm = this.cm.sm;
        this.card_config = card;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.speed = 1000;
        this.state = 'board'; // 'board', 'book'
        this.role = null;
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
    }

    update_x_y() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta * 0.001);
        this.move_length -= moved;
        this.x += moved * this.vx;
        this.y += moved * this.vy;
    }

    start() {

    }

    update() {
        this.update_x_y();
        this.render();
    }

    render() {
        let gem_step = 98;
        let spend_step = 100;
        let spend_index = [2, 0, 3, 1];
        let gem_step_x = 40;
        let gem_step_y = 15;
        this.sm.shader_card_back(this.x, this.y, this.card_config.backIndex[0], this.card_config.backIndex[1]);
        this.sm.shader_top_back(this.x, this.y, [1, 1, 1, 0.5]);
        this.sm.shader_score(this.x, this.y, this.card_config.score - 1);
        this.sm.shader_gem(this.x + gem_step, this.y, GemColor2Index[this.card_config.gem]);
        this.card_config.spend.forEach((value, index) => {
            index = spend_index[index];
            let iy = Math.floor(index / 2);
            let ix = index % 2;
            let backi = NSColor2Index[value.color];
            let needi = value.need - 1;
            this.sm.shader_spend(this.x + ix * 50, this.y + spend_step + iy * 50, backi, needi);
        });
        this.card_config.spend.forEach((value, index) => {
            index = spend_index[index];
            let iy = Math.floor(index / 2);
            let ix = index % 2;
            let gemi = GemColor2Index[value.color];
            this.sm.shader_gem(this.x + ix * 50 + gem_step_x, this.y + iy * 50 + gem_step_y + spend_step, gemi, { scale_x: 20, scale_y: 20 });
        });
    }
}