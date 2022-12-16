class RectShader {
    constructor(shader_manager){
        this.shader_manager = shader_manager;
        this.name = 'RectShader';
        this.shader_manager.shader_dict[this.name] = this;
        console.log('loading shader', this.name);
        this.init();
    }

    shader_text(){
        this.vs = `
            attribute vec2 a_position;
            uniform vec2 u_resolution;

            void main(){
                vec2 clipSpace = a_position / u_resolution * 2.0 - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
            }
        `;
        this.fs = `
            precision mediump float;

            uniform vec4 u_color;

            void main(){
                gl_FragColor = u_color;
            }
        `;
    }

    init(){
        this.shader_text();
        const sm = this.shader_manager;
        const gl = sm.gl;
        const program = sm.createProgramFromText(gl, this.vs, this.fs);
        this.a_positionLoc = gl.getAttribLocation(program, 'a_position');
        this.u_resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
        this.u_colorLoc = gl.getUniformLocation(program, 'u_color');
        this.program = program;
    }

    init_data_buffer(gl, a_position_data){
        this.a_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.a_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a_position_data), gl.STATIC_DRAW);
    }
    // main
    draw(a_position_data, u_color){
        const sm = this.shader_manager;
        const gl = sm.gl;
        this.init_data_buffer(gl, a_position_data);
        sm.resize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(this.program);
        this.set_attrib_pointer(gl);
        this.set_uniform(gl, u_color);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    set_uniform(gl, u_color){
        gl.uniform2fv(this.u_resolutionLoc, [gl.canvas.width, gl.canvas.height]);
        gl.uniform4fv(this.u_colorLoc, u_color);
    }

    set_attrib_pointer(gl){
        gl.enableVertexAttribArray(this.a_positionLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.a_position_buffer);
        gl.vertexAttribPointer(this.a_positionLoc, 2, gl.FLOAT, false, 0, 0);
    }
}
