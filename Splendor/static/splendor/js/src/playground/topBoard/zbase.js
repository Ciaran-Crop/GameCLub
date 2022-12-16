class TopBoard extends GameObject {
    constructor(playground){
        super();
        this.playground = playground;
        this.room_id = this.playground.room_id;
        this.round = 1;
        this.time = 0;
        this.tu = this.playground.textureUtil;
        this.sm = this.playground.shader_manager;
        this.gl = this.sm.gl;
        this.rect_shader = this.sm.get('RectShader');
    }

    start(){
    }

    update(){
        this.u_color = [0,0,0,0.5];
        let y = 0;
        let width = this.gl.canvas.width / 3;
        let height = this.gl.canvas.height / 12;
        let x = this.gl.canvas.width / 2 - width / 2;
        this.a_position_data = this.tu.get_point_from(x, y, width, height);
        this.render();
    }

    render(){
        this.rect_shader.draw(this.a_position_data, this.u_color);
    }
}
