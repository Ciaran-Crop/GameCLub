class ImageShader {
    constructor(shader_manager) {
        this.sm = shader_manager;
        this.gl = this.sm.gl;
        this.name = 'ImageShader';
        this.sm.shader_dict[this.name] = this;
        console.log('loading shader', this.name);
        this.init();
    }

    shader_text() {
        this.vs = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;

        uniform mat3 u_position_matrix;
        uniform mat3 u_texCoord_matrix;
        
        varying vec2 v_texCoord;
        
        void main() {
            gl_Position = vec4((u_position_matrix * vec3(a_position, 1)).xy, 0, 1);
            v_texCoord = (u_texCoord_matrix * vec3(a_texCoord, 1)).xy;
        }
        `;

        this.fs = `
        precision mediump float;
        
        uniform sampler2D u_image;
        
        varying vec2 v_texCoord;
        
        void main() {
            gl_FragColor = texture2D(u_image, v_texCoord);
        }
        `;
    }

    init() {
        const gl = this.gl;
        const sm = this.sm;
        this.shader_text();
        let program = sm.createProgramFromText(gl, this.vs, this.fs);
        let a_positionLoc = gl.getAttribLocation(program, 'a_position');
        let a_texCoordLoc = gl.getAttribLocation(program, 'a_texCoord');
        let u_resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
        let u_position_matrixLoc = gl.getUniformLocation(program, 'u_position_matrix');
        let u_texCoord_matrixLoc = gl.getUniformLocation(program, 'u_texCoord_matrix');
        let u_imageLoc = gl.getUniformLocation(program, 'u_image');
        const a_position_data = new Float32Array(sm.get_point_from(0, 0, 1, 1));
        const a_texCoord_data = new Float32Array(sm.get_point_from(0, 0, 1, 1));
        const a_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, a_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, a_position_data, gl.STATIC_DRAW);

        const a_texCoord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, a_texCoord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, a_texCoord_data, gl.STATIC_DRAW);
        let programInfo = {
            program: program,
            a_position: { loc: a_positionLoc, buffer: a_position_buffer },
            a_texCoord: { loc: a_texCoordLoc, buffer: a_texCoord_buffer },
            u_resolution: u_resolutionLoc,
            u_image: u_imageLoc,
            u_position_matrix: u_position_matrixLoc,
            u_texCoord_matrix: u_texCoord_matrixLoc,
        }
        this.programInfo = programInfo;
    }

    draw(texture, u_position_matrix, u_texCoord_matrix){
        const gl = this.gl;
        const sm = this.sm;
        let programInfo = this.programInfo;

        sm.resize(gl);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(programInfo.program);
        this.set_pointer(programInfo);
        this.set_uniform(programInfo, texture, u_position_matrix, u_texCoord_matrix);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    set_pointer(programInfo) {
        const gl = this.gl;

        const a_positionLoc = programInfo.a_position.loc;
        const a_position_buffer = programInfo.a_position.buffer;
        gl.enableVertexAttribArray(a_positionLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, a_position_buffer);

        gl.vertexAttribPointer(a_positionLoc, 2, gl.FLOAT, false, 0, 0);

        const a_texCoordLoc = programInfo.a_texCoord.loc;
        const a_texCoord_buffer = programInfo.a_texCoord.buffer;
        gl.enableVertexAttribArray(a_texCoordLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, a_texCoord_buffer);

        gl.vertexAttribPointer(a_texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    }

    set_uniform(programInfo, texture, u_position_matrix, u_texCoord_matrix) {
        const gl = this.gl;
        gl.uniform2fv(programInfo.u_resolution, [gl.canvas.width, gl.canvas.height]);
        gl.uniformMatrix3fv(programInfo.u_position_matrix, false, u_position_matrix);
        gl.uniformMatrix3fv(programInfo.u_texCoord_matrix, false, u_texCoord_matrix);
        let texUnit = 2;
        gl.activeTexture(gl.TEXTURE0 + texUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programInfo.u_image, texUnit);
    }
}
