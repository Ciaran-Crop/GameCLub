class Token extends GameObject {
    constructor(token_manager, color, x, y) {
        super();
        this.tm = token_manager;
        this.playground = this.tm.playground;
        this.sm = this.tm.sm;
        this.gl = this.tm.gl;
        this.color = color;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        const gl = this.gl;
        this.move_length = 0;
        this.speed = fix(gl, token_speed, true);
        this.state = 'board' // 'select', 'unshow'
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

    change_state(state) {
        this.state = state;
    }

    update_offset(){
        const gl = this.gl;
        this.speed = fix(gl, token_speed, true);
        this.x = fix(gl, this.x, true, {pre_size: this.playground.pre_size});
        this.y = fix(gl, this.y, false, {pre_size: this.playground.pre_size});
    }

    update() {
        if (this.state !== 'unshow') {
            this.update_x_y();
            this.render();
        }
        if (this.state === 'on_de'){
            if(this.move_length === 0) this.destroy();
        }
    }

    render() {
        this.sm.shader_token(this.x, this.y, TokenColor2Index[this.color]);
    }
}