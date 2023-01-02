class ShaderManager {
    constructor(playground) {
        this.playground = playground;
        this.gl = this.playground.gl;
        this.shader_dict = {};
    }

    shader_player_photo(email, offset_x, offset_y, options) {
        let imageShader = this.get('ImageShader');
        let texture = this.tm.get('players')[email];
        options = options || {};
        let scale_x = options.scale_x || fix(this.gl,shader_player_photo_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl,shader_player_photo_scale_y, false);
        let scale = options.scale || 1;
        let rotation = options.rotation || 0;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0, 0], 0, [1, 1], true);
        imageShader.draw(texture, u_position_matrix, u_texCoord_matrix);
    }

    shader_card_back(offset_x, offset_y, p_x, p_y, options) {
        let imageShader = this.get('ImageShader');
        let texture = this.tm.get('cards');
        options = options || {};
        let scale_x = options.scale_x || fix(this.gl, shader_card_back_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl, shader_card_back_scale_y, false);
        let rotation = options.rotation || 0;
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0.2 * p_x, 0.1666 * p_y], 0, [0.1998, 0.1665], true);
        imageShader.draw(texture, u_position_matrix, u_texCoord_matrix);
    }

    shader_top_back(offset_x, offset_y, u_color, options) {
        let rectShader = this.get('RectShader');
        options = options || {};
        let rotation = options.rotation || 0;
        let scale_x = options.scale_x || fix(this.gl, shader_top_back_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl, shader_top_back_scale_y, false);
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        rectShader.draw(u_position_matrix, u_color);
    }

    shader_score(offset_x, offset_y, i, options) {
        let imageShader = this.get('ImageShader');
        let texture = this.tm.get('numbers_sheet');
        options = options || {};
        let rotation = options.rotation || 0;
        let scale_x = options.scale_x || fix(this.gl, shader_score_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl, shader_score_scale_y, false);
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0.1 * i, 0.6666], 0, [0.1, 0.3333], true);
        imageShader.draw(texture, u_position_matrix, u_texCoord_matrix);
    }

    shader_mini_card_back(offset_x, offset_y, i, options) {
        let imageShader = this.get('ImageShader');
        let texture = this.tm.get('numbers_sheet');
        options = options || {};
        let rotation = options.rotation || 0;
        let scale_x = options.scale_x || fix(this.gl, shader_mini_card_back_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl, shader_mini_card_back_scale_y, false);
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0.1 * i, 0], 0, [0.1, 0.3333], true);
        imageShader.draw(texture, u_position_matrix, u_texCoord_matrix);
    }

    shader_gem(offset_x, offset_y, i, options) {
        let imageShader = this.get('ImageShader');
        let texture = this.tm.get('gems');
        options = options || {};
        let rotation = options.rotation || 0;
        let scale_x = options.scale_x || fix(this.gl, shader_gem_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl, shader_gem_scale_y, false);
        let fix_x_step = fix(this.gl, shader_gem_fix_x_step, true);
        let fix_y_step = fix(this.gl, shader_gem_fix_y_step, true);
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x + fix_x_step, offset_y + fix_y_step], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0.2 * i, 0], 0, [0.2, 1], true);
        imageShader.draw(texture, u_position_matrix, u_texCoord_matrix);
    }

    shader_spend(offset_x, offset_y, backi, needi, options) {
        let imageShader = this.get('ImageShader');
        let number_sheet_texture = this.tm.get('numbers_sheet');
        let rotation = 0;
        let scale_x = fix(this.gl, shader_spend_scale_x, true);
        let scale_y = fix(this.gl, shader_spend_scale_y, false);
        options = options || {};
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0.1 * backi, 0.3333], 0, [0.1, 0.3333], true);
        imageShader.draw(number_sheet_texture, u_position_matrix, u_texCoord_matrix);
        this.shader_score(offset_x, offset_y, needi, options);
    }

    shader_token(offset_x, offset_y, tokeni, options) {
        let imageShader = this.get('ImageShader');
        let texture = this.tm.get('tokens');
        options = options || {};
        let rotation = options.rotation || 0;
        let scale_x = options.scale_x || fix(this.gl, shader_token_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl, shader_token_scale_y, false);
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0.16666 * tokeni, 0], 0, [0.16667, 1], true);
        imageShader.draw(texture, u_position_matrix, u_texCoord_matrix);
    }

    shader_noble(offset_x, offset_y, noblei_x, noblei_y, options) {
        let imageShader = this.get('ImageShader');
        let texture = this.tm.get('nobles');
        options = options || {};
        let rotation = options.rotation || 0;
        let scale_x = options.scale_x || fix(this.gl, shader_noble_scale_x, true);
        let scale_y = options.scale_y || fix(this.gl, shader_noble_scale_y, false);
        let scale = options.scale || 1;
        let u_position_matrix = get_matrix(this.gl, [offset_x, offset_y], rotation, [scale_x * scale, scale_y * scale], false);
        let u_texCoord_matrix = get_matrix(this.gl, [0.2 * noblei_x, 0.5 * noblei_y], 0, [0.2, 0.5], true);
        imageShader.draw(texture, u_position_matrix, u_texCoord_matrix);
    }

    get(shader_name) {
        return this.shader_dict[shader_name];
    }

    resize(gl) {
        const canvas = gl.canvas;
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        const needResize = canvas.width !== displayWidth ||
          canvas.height !== displayHeight;
        if (needResize) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
        }
        return needResize;
    }

    before_render() {
        const gl = this.gl;
        this.resize(gl);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    createProgramFromText(gl, vs_text, fs_text) {
        const vs = this.createShader(gl, gl.VERTEX_SHADER, vs_text);
        const fs = this.createShader(gl, gl.FRAGMENT_SHADER, fs_text);
        return this.createProgram(gl, vs, fs);
    }

    createShader(gl, type, source) {
        let shader = gl.createShader(type); // 创建着色器对象
        gl.shaderSource(shader, source); // 提供数据源
        gl.compileShader(shader); // 编译 -> 生成着色器
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    createProgram(gl, vertexShader, fragmentShader) {
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    get_point_from(x, y, width, height) {
        let x1 = x;
        let x2 = x + width;
        let y1 = y;
        let y2 = y + height;
        return [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ];
    }

    randomint_from_xy(x, y) {
        let a = Math.floor(x + Math.random() * (y - x));
        return a;
    }

    init() {
        new ImageShader(this);
        new RectShader(this);
        this.tm = new PreProcessTexture(this);
    }
}
