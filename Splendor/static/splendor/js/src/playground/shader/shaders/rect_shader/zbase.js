class RectShader {
    constructor(shader_manager){
        this.sm = shader_manager;
        this.gl = this.sm.gl;
        this.name = 'RectShader';
        this.sm.shader_dict[this.name] = this;
        console.log('loading shader', this.name);
        this.init();
    }

    shader_text(){
        this.vs = `
            attribute vec2 a_position;

            uniform mat3 u_position_matrix;

            void main(){
                gl_Position = vec4((u_position_matrix * vec3(a_position, 1)).xy, 0, 1);
            }
        `;
        this.fs = `
            precision highp float;

            uniform vec4 u_color;

            void main(){
                gl_FragColor = u_color;
            }
        `;
    }

    init() {
        const gl = this.gl;
        const sm = this.sm;
        this.shader_text();
        let program = sm.createProgramFromText(gl, this.vs, this.fs);
        let a_positionLoc = gl.getAttribLocation(program, 'a_position');
        let u_position_matrixLoc = gl.getUniformLocation(program, 'u_position_matrix');
        let u_colorLoc = gl.getUniformLocation(program, 'u_color');
        const a_position_data = new Float32Array(sm.get_point_from(0, 0, 1, 1));
        const a_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, a_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, a_position_data, gl.STATIC_DRAW);
        let programInfo = {
            program: program,
            a_position: { loc: a_positionLoc, buffer: a_position_buffer },
            u_position_matrix: u_position_matrixLoc,
            u_color: u_colorLoc,
        }
        this.programInfo = programInfo;
    }

    draw(u_position_matrix, u_color) {
        const gl = this.gl;
        const sm = this.sm;
        let programInfo = this.programInfo;

        sm.resize(gl);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(programInfo.program);
        this.set_pointer(programInfo);
        this.set_uniform(programInfo,u_position_matrix, u_color);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    set_pointer(programInfo) {
        const gl = this.gl;

        const a_positionLoc = programInfo.a_position.loc;
        const a_position_buffer = programInfo.a_position.buffer;
        gl.enableVertexAttribArray(a_positionLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, a_position_buffer);

        gl.vertexAttribPointer(a_positionLoc, 2, gl.FLOAT, false, 0, 0);
    }

    set_uniform(programInfo, u_position_matrix, u_color) {
        const gl = this.gl;
        gl.uniformMatrix3fv(programInfo.u_position_matrix, false, u_position_matrix);
        gl.uniform4fv(programInfo.u_color, u_color);
    }

}