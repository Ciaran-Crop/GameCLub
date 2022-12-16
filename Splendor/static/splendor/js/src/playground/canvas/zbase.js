class TextureUtil {
    constructor(){
        this.ctx = document.createElement('canvas').getContext('2d');
    }

    get_point_from(x, y, width, height) {
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        return [
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ];
    }

    makeTexture(gl) {
        let tex = gl.createTexture();
        const ctx = this.ctx;
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        return tex;
    }

    makeCircleTexture(gl, options){
        options = options || {};
        var width  = options.width  || 128;
        var height = options.height || 128;
        var color1 = options.color1 || "white";
        var color2 = options.color2 || "black";

        this.setCanvasSize(width, height);
        const ctx = this.ctx;

        var size = Math.min(width, height);
        ctx.fillStyle = color1 || "white";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = color2 || "black";
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.beginPath();
        ctx.arc(0, 0, width / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = color1 || "white";
        ctx.beginPath();
        ctx.arc(0, 0, width / 4 - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return makeTexture(gl);
    }

    setCanvasSize(width, height){
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
    }
}
