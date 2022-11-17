class SPGameBoard extends SPGameObject {
    constructor(playground){
        super();
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.room_capity = 3;
        this.text = "Wating! 已就绪: " + this.playground.players.length + "人";
        this.start();
    }

    start(){

    }

    write(text){
        this.text = text;
    }

    update_text(){
        if(this.playground.players.length >= 3 && this.playground.status === 'waiting'){
            this.write("Game Fighting!");
            this.playground.status = 'fighting';
        }else if(this.playground.players.length < 3 && this.playground.status === 'waiting') {
            this.write("Waiting! 已就绪" + this.playground.players.length + "人");
        }else if(this.playground.get_me() === null && this.playground.status === 'fighting'){
            this.write("Game Over!");
            this.playground.status = 'over';
            this.playground.sp_game_score_board.lose();
        }else if(this.playground.players.length === 1){
            if(this.playground.players[0].is_who() === 'me' ){
                this.write("End!");
                this.playground.status = 'end';
                this.playground.sp_game_score_board.win();
            }
            else{
                this.write("Game Over!");
                this.playground.status = 'over';
                this.playground.sp_game_score_board.lose();
            }
        }
    }

    update(){
        this.update_text();
        this.render();
    }

    render(){
        this.ctx.font = "48px serif";
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.text, this.playground.width / 2, 0)
    }
}
