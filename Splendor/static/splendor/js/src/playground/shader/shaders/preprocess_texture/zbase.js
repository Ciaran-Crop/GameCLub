class PreProcessTexture {
    constructor(shader_manager){
        this.sm = shader_manager;
        this.base_url = `/static/splendor/assets`;
        this.texture_dict = {cards: null, gems: null, nobles: null, tokens: null, numbers_sheet: null};
        this.start();
    }

    start(){
        this.preProcess();
    }

    init_texture(image){
        const gl = this.sm.gl;
        const u_image_texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, u_image_texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        return u_image_texture;
    }

    preProcess(){
        for(let key in this.texture_dict){
            let image = new Image();
            image.src = `${this.base_url}/${key}.jpg`;
            image.onload = () => {
                this.texture_dict[key] = this.init_texture(image);
            }
        }
        this.texture_dict.players = {};
        for(let key in this.sm.playground.players){
            let photo = this.sm.playground.players[key].photo;
            let email = this.sm.playground.players[key].email;
            let image = new Image();
            image.src = photo;
            image.onload = () => {
                this.texture_dict.players[email] = this.init_texture(image);
            }
        }
    }

    get(key){
        return this.texture_dict[key];
    }
}