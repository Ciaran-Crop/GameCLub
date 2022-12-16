class ShaderManager{
    constructor(playground){
        this.playground = playground;
        this.gl = this.playground.gl;
        this.shader_dict = {};
    }

    get(shader_name){
        return this.shader_dict[shader_name];
    }

    resize(canvas){
        const width  = canvas.clientWidth;
        const height = canvas.clientHeight;
        if(canvas.width !== width || canvas.height !== height){
            canvas.width = width;
            canvas.height = height;
        }
    }

    before_render(){
        const gl = this.gl;
        this.resize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    createProgramFromText(gl, vs_text, fs_text){
        const vs= this.createShader(gl, gl.VERTEX_SHADER, vs_text);
        const fs = this.createShader(gl, gl.FRAGMENT_SHADER, fs_text);
        return this.createProgram(gl, vs, fs);
    }

    createShader(gl, type, source) {
        var shader = gl.createShader(type); // 创建着色器对象
        gl.shaderSource(shader, source); // 提供数据源
        gl.compileShader(shader); // 编译 -> 生成着色器
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    createProgram(gl, vertexShader, fragmentShader) {
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    init(){
        new ImageShader(this);
        new CanvasShader(this);
        new RectShader(this);
    }
}
