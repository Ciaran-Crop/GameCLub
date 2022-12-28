class Noble extends GameObject {
    constructor(noble_manager, noble_config, index) {
        super();
        this.nm = noble_manager;
        this.sm = this.nm.sm;
        this.noble_config = noble_config;
        this.state = 'board' // 'player'
        this.role = null;
        let offset_x = 1110 - 40;
        let offset_y = 77;
        let y_step = 35 + 140;
        this.x = offset_x;
        this.y = offset_y + index * y_step;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.speed = 800;
    }

    start() { }

    change_state(state) {
        this.state = state;
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
    update() {
        this.update_x_y();
        this.render();
    }

    render() {
        this.sm.shader_noble(this.x, this.y, this.noble_config.backIndex[1], this.noble_config.backIndex[0]);
        this.sm.shader_score(this.x + 90, this.y, this.noble_config['score'] - 1);
        this.sm.shader_top_back(this.x + 54, this.y, [1, 1, 1, 0.2], { scale_x: 140, rotation: Math.PI / 2 * 3 });
        let index = 1;
        let t_step = 45;
        let fix_step = 10;
        for (let spi in this.noble_config.spend) {
            let sp = this.noble_config.spend[spi];
            let colori = NSColor2Index[sp.color];
            let gemi = GemColor2Index[sp.color];
            let need = sp.need - 1;
            // console.log(colori, gemi, need);
            this.sm.shader_mini_card_back(this.x + 10, this.y + 145 - t_step * index, colori);
            this.sm.shader_score(this.x + 10, this.y + 145 - t_step * index, need, { scale_x: 35, scale_y: 35 });
            this.sm.shader_gem(this.x + 10 + fix_step * 2.5, this.y + 155 - t_step * index, gemi, { scale_x: 15, scale_y: 15 });
            index++;
        }
    }
}