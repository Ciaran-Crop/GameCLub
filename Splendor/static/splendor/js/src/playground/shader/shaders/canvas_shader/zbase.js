class CanvasShader {
    constructor(shader_manager){
        this.shader_manager = shader_manager;
        this.name = 'CanvasShader';
        this.shader_manager.shader_dict[this.name] = this;
        console.log('loading shader', this.name);
        this.init();
    }

    shader_text(){
        this.vs = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            uniform vec2 u_resolution;

            varying vec2 v_texCoord;

            void main(){
                vec2 clipSpace = a_position / u_resolution * 2.0 - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                v_texCoord = a_texCoord;
            }
        `;
        this.fs = `
            precision highp float;

            uniform sampler2D u_canvas_tex;

            varying vec2 v_texCoord;

            void main(){
                gl_FragColor = texture2D(u_canvas_tex, v_texCoord);
            }
        `;
    }

    init(){
        this.shader_text();
        const sm = this.shader_manager;
        const gl = sm.gl;
        const program = sm.createProgramFromText(gl, this.vs, this.fs);
        this.a_positionLoc = gl.getAttribLocation(program, 'a_position');
        this.a_texCoordLoc = gl.getAttribLocation(program, 'a_texCoord');
        this.u_resolutionLoc = gl.getUniformLocation(program, 'u_resolution');
        this.u_canvas_texLoc = gl.getUniformLocation(program, 'u_canvas_tex');
        this.program = program;
    }

    draw(a_position_data, a_texCoord_data, u_canvas){
        const sm = this.shader_manager;
        const gl = sm.gl;
        this.init_data_buffer(gl, a_position_data, a_texCoord_data, u_canvas);
        sm.resize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.useProgram(this.program);
        this.set_attrib_pointer(gl);
        this.set_uniform(gl);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    set_uniform(gl){
        gl.uniform2fv(this.u_resolutionLoc, [gl.canvas.width, gl.canvas.height]);
    }

    set_attrib_pointer(gl){
        gl.enableVertexAttribArray(this.a_positionLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.a_position_buffer);
        gl.vertexAttribPointer(this.a_positionLoc, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(this.a_texCoordLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.a_texCoord_buffer);
        gl.vertexAttribPointer(this.a_texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    }

    init_data_buffer(gl, a_position_data, a_texCoord_data, u_canvas){
        // a_position
        this.a_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.a_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a_position_data), gl.STATIC_DRAW);
        // a_texCoord
        this.a_texCoord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.a_texCoord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(a_texCoord_data), gl.STATIC_DRAW);
        // u_canvas
        this.u_canvas_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.u_canvas_texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, u_canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
}
