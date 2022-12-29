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
        this.scale = 1;
    }

    start() { }

    change_state(state) {
        this.state = state;
    }

    change_scale(scale){
        this.scale = scale;
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
        let score_x_step = 90 * this.scale;
        let top_back_x_step = 54 * this.scale;
        this.sm.shader_noble(this.x, this.y, this.noble_config.backIndex[1], this.noble_config.backIndex[0], {scale: this.scale});
        this.sm.shader_score(this.x + score_x_step, this.y, this.noble_config['score'] - 1, {scale: this.scale});
        this.sm.shader_top_back(this.x + top_back_x_step, this.y, [1, 1, 1, 0.2], { scale_x: 140, rotation: Math.PI / 2 * 3, scale: this.scale});
        let index = 1;
        let t_step = 45 * this.scale;
        let fix_step = 10 * this.scale;
        let x_fix_step = 10 * this.scale;
        let y_fix_step = 145 * this.scale;
        for (let spi in this.noble_config.spend) {
            let sp = this.noble_config.spend[spi];
            let colori = NSColor2Index[sp.color];
            let gemi = GemColor2Index[sp.color];
            let need = sp.need - 1;
            this.sm.shader_mini_card_back(this.x + x_fix_step, this.y + y_fix_step - t_step * index, colori, {scale: this.scale});
            this.sm.shader_score(this.x + x_fix_step, this.y + y_fix_step - t_step * index, need, { scale_x: 35, scale_y: 35, scale: this.scale});
            this.sm.shader_gem(this.x + x_fix_step + fix_step * 2.5, this.y + y_fix_step + x_fix_step - t_step * index, gemi, { scale_x: 15, scale_y: 15, scale: this.scale});
            index++;
        }
    }
}