class TextureUtil {
    constructor(){
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

    makeTextTexture(text, options){
        let ctx = document.createElement('canvas').getContext('2d');
        options = options || {};
        let fontcolor = options.fontcolor || 'black';
        let fontsize = options.fontsize || '30px';
        let fontfamily = options.fontfamily || 'Microsoft YaHei';
        let x = options.x || 0;
        let y = options.y || 0;
        let width = options.width || 10;
        let height = options.height || 10;

        let font = fontsize + ' ' + fontfamily;
        this.setCanvasSize(ctx.canvas, width, height);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = fontcolor;
        ctx.font = font;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillText(text, x, y);
        return ctx.canvas;
    }

    setCanvasSize(canvas, width, height){
        canvas.width = width;
        canvas.height = height;
    }
}
