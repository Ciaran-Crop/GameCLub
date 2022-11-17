class SPGameScoreBoard extends SPGameObject {
    constructor(playground){
        super();
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.state = 'none';

        this.win_img = new Image();
        this.win_img.src = "https://app3774.acapp.acwing.com.cn/static/superperson/images/playground/win.jpg";
        this.lose_img = new Image();
        this.lose_img.src = "https://app3774.acapp.acwing.com.cn/static/superperson/images/playground/lose.jpg";

        this.$canvas = this.playground.sp_game_map.$canvas;
    }

    start(){

    }

    add_listening_events(){
        let outer = this;
        this.$canvas.on('click', function(){
            outer.playground.hide();
            outer.playground.root.menu.show();
        });
    }

    add_return_func(){
        let outer = this;
        setTimeout(function(){
            outer.add_listening_events();
        }, 1000);
    }

    win(){
        this.state = "win";
        this.add_return_func();
    }

    lose(){
        this.state = "lose"
        this.add_return_func();
    }

    late_update(){
        this.render();
    }

    render(){
        let len = this.playground.height / 2;
        if(this.state === 'win') this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        if(this.state === 'lose') this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
    }
}
