class Noble extends GameObject {
    constructor(noble_manager, noble_config, index) {
        super();
        this.nm = noble_manager;
        this.playground = this.nm.playground;
        this.sm = this.nm.sm;
        this.am = this.nm.am;
        this.gl = this.nm.gl;
        this.noble_config = noble_config;
        this.state = 'board' // 'player'
        this.role = null;
        const gl = this.gl;
        let offset_x = fix(gl, noble_offset_x, true);
        let offset_y = fix(gl, noble_offset_y, false);
        let y_step = fix(gl, noble_y_step, false);
        this.index = index;
        this.x = offset_x;
        this.y = offset_y + index * y_step;
        this.vx = 0;
        this.vy = 0;
        this.move_length = 0;
        this.speed = fix(gl, noble_speed, true);
        this.scale = 1;
        this.change_speed = 0.6;
        this.scale_change_flag = 1;
        this.scale_change = 0;
    }

    start() { }

    change_state(state) {
        this.state = state;
    }

    change_scale(scale){
        this.scale_change_flag = scale > this.scale ? 1 : -1;
        this.scale_change = Math.abs(scale - this.scale);
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

    update_offset(){
        const gl = this.gl;
        this.x = fix(gl, this.x, true, {pre_size: this.playground.pre_size});
        this.y = fix(gl, this.y, false, {pre_size: this.playground.pre_size});
        this.speed = fix(gl, noble_speed, true);
    }

    update() {
        this.update_x_y();
        this.update_scale();
        this.render();
    }

    render() {
        const gl = this.gl;
        let score_x_step = fix(gl, noble_score_x_step, true) * this.scale;
        let top_back_x_step = fix(gl, noble_top_back_x_step, true) * this.scale;
        this.sm.shader_noble(this.x, this.y, this.noble_config.backIndex[1], this.noble_config.backIndex[0], {scale: this.scale});
        this.sm.shader_score(this.x + score_x_step, this.y, this.noble_config['score'] - 1, {scale: this.scale});
        this.sm.shader_top_back(this.x + top_back_x_step, this.y, [1, 1, 1, 0.2], { scale_x: fix(gl, noble_top_back_scale_x, false), scale_y: fix(gl, noble_top_back_scale_y, true), rotation: Math.PI / 2 * 3, scale: this.scale});
        let index = 1;
        let t_step = fix(gl, noble_t_step, false) * this.scale;
        let fix_step = fix(gl, noble_fix_step, true) * this.scale;
        let x_fix_step = fix(gl, noble_x_fix_step, true) * this.scale;
        let y_fix_step = fix(gl, noble_y_fix_step, false) * this.scale;
        for (let spi in this.noble_config.spend) {
            let sp = this.noble_config.spend[spi];
            let colori = NSColor2Index[sp.color];
            let gemi = GemColor2Index[sp.color];
            let need = sp.need - 1;
            this.sm.shader_mini_card_back(this.x + x_fix_step, this.y + y_fix_step - t_step * index, colori, {scale: this.scale});
            this.sm.shader_score(this.x + x_fix_step, this.y + y_fix_step - t_step * index, need, { scale_x: fix(gl, noble_score_scale_x, true), scale_y: fix(gl, noble_score_scale_y, false), scale: this.scale});
            this.sm.shader_gem(this.x + x_fix_step + fix_step * 2.5, this.y + y_fix_step - t_step * index, gemi, { scale_x: fix(gl, noble_gem_scale_x, true), scale_y: fix(gl, noble_gem_scale_y, false), scale: this.scale});
            index++;
        }
    }
}