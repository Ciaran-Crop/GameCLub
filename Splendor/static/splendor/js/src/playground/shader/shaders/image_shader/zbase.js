class ImageShader {
    constructor(shader_manager){
        this.shader_manager = shader_manager;
        this.name = 'ImageShader';
        console.log('loading shader', this.name);
        this.init();
    }

    init(){}
}
