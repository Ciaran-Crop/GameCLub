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
        this.canvas_shader = this.sm.get('CanvasShader');
    }

    start(){
    }

    update_room(){
        let width = this.gl.canvas.width / 4;
        let height = this.gl.canvas.height / 12;
        let x = this.gl.canvas.width / 2 - width * 1.05 ;
        let y = 0;
        this.room_a_position_data = this.tu.get_point_from(x, y, width, height);
        this.room_a_texCoord_data = this.tu.get_point_from(0, 0, 1, 1);

        this.room_u_canvas_data = this.tu.makeTextTexture('房间名: ' + this.room_id, {width: width, height: height, fontsize: '20px', x: width / 2, y: height / 2, fontcolor: 'Gold'});
    }

    update_time(){
        let width = this.gl.canvas.width / 8;
        let height = this.gl.canvas.height / 12;
        let x = this.gl.canvas.width / 2 - width / 2;
        let y = 0;
        this.text_a_position_data = this.tu.get_point_from(x, y, width, height);
        this.text_a_texCoord_data = this.tu.get_point_from(0, 0, 1, 1);

        this.time += this.timedelta * 0.001;
        let second = Math.floor(this.time % 60);
        let minute = Math.floor(this.time / 60);
        if(second < 10) second = '0' + second;
        if(minute < 10) minute = '0' + minute;

        this.text_u_canvas_data = this.tu.makeTextTexture(minute + ':' + second, {width: width, height: height, fontsize: '38px', x: width / 2, y:height / 2, fontcolor: 'white'});
    }

    update_border(){
        this.u_color = [0,0,0,0.8];
        let y = 0;
        let width = this.gl.canvas.width / 2;
        let height = this.gl.canvas.height / 12;
        let x = this.gl.canvas.width / 2 - width / 2;
        this.a_position_data = this.tu.get_point_from(x, y, width, height);
    }

    update(){
        this.update_border();
        this.update_time();
        this.update_room();
        this.render();
    }

    render(){
        this.rect_shader.draw(this.a_position_data, this.u_color);
        this.canvas_shader.draw(this.text_a_position_data, this.text_a_texCoord_data, this.text_u_canvas_data);
        this.canvas_shader.draw(this.room_a_position_data, this.room_a_texCoord_data, this.room_u_canvas_data);
    }
}
