class TopBoard {
    constructor(playground) {
        this.playground = playground;
        this.room_id = this.playground.room_id;
        this.time = 0;
        this.player_time = this.playground.round_second;
        this.$top_board = $(`
<div class='top-board'>
    <div class='top-board-center'>
    <span>00:00</span>
    </div>
    <div class='top-board-out'>
        <button>退出游戏</button>
    </div>
</div>        
`);
        this.$token_click = $(`
<div class='token-click'>
        <button class='pick'>确定</button>
        <button class='cancel'>取消</button>
</div>        
`);
        this.$click_card = $(`
<div class='card-click'>
    <div class='element buy'>
    购买
    </div>        
    <div class='element book'>
    预定
    </div>
    <div class='element cancle'>
    取消
    </div>
</div>
`);
        this.$error_message = $(`
<div class='error-message'>
</div>        
`);
this.$game_score = $(`
<div class='game-score-list'>
</div>
`);
this.$player_tick = $(`
<div class='player-tick'>
</div>
`);
this.$pass_click = $(`
<div class='pass-click'>
跳过
</div>
`);
        for(let i in this.playground.players){
            let p = this.playground.players[i];
            this.$game_score.append(`<div class='game-score' name=${p.email}>
            0
            </div>`);
        }
        this.playground.$playground_div.append(this.$top_board);
        this.playground.$playground_div.append(this.$click_card);
        this.playground.$playground_div.append(this.$error_message);
        this.playground.$playground_div.append(this.$token_click);
        this.playground.$playground_div.append(this.$game_score);
        this.playground.$playground_div.append(this.$player_tick);
        this.playground.$playground_div.append(this.$pass_click);
        this.start();
    }

    add_listening_events() {
        this.time_func = setInterval(() => {
            this.time++;
            let min = Math.floor(this.time / 60);
            let sec = this.time % 60;
            if (sec < 10) sec = '0' + sec;
            if (min < 10) min = '0' + min;
            this.$top_board.find('.top-board-center > span').text(min + ':' + sec);
        }, 1000);
        this.$top_board.find('.top-board-out').on('click', () => {
            window.location.reload();
        });
        this.$token_click.find('.cancel').on('click', () => {
            this.playground.tokens_manager.unselect_by_player();
            this.click_card_remove_no_click();
            this.click_card_remove_scale();
            this.$token_click.hide();
        });
        this.$token_click.find('.pick').on('click', () => {
            this.playground.tokens_manager.picked_by_me();
            this.click_card_remove_no_click();
            this.click_card_remove_scale();
            this.$token_click.hide();
        });
        this.$click_card.find('.cancle').on('click', () => {
            this.click_card_remove_no_click();
            this.click_card_remove_scale();
            this.$click_card.hide();
        });
        this.$click_card.find('.book').on('click', () => {
            if(this.$click_card.find('.book').hasClass('no-click')) return false;
            let me = this.playground.players_manager.get_me();
            this.card.book_by_player(me);
            this.$click_card.hide();
        });
        this.$click_card.find('.buy').on('click', () => {
            if(this.$click_card.find('.buy').hasClass('no-click')) return false;
            let me = this.playground.players_manager.get_me();
            this.card.buy_by_player(me);
            this.$click_card.hide();
        });
        this.$pass_click.on('click', () => {
            let me = this.playground.players_manager.is_me_round();
            let player = this.playground.players_manager.get_me();
            if(me){
                player.pass();
            }
        }); 
    }

    is_show(element){
        if(element === 'click_card') return this.$click_card.css('display') === 'block';
        else if(element === 'token_click') return this.$token_click.css('display') === 'block';
    }

    add_tick(player){
        this.clear_interval('tick');
        this.$player_tick.css('top', player.index * 10.5 + 8 + 'vw');
        this.$player_tick.show();
        if(player.character === 'me') this.$pass_click.show();
        if(player.character === 'robot'){
            player.timeout_func = setTimeout(() => {
                player.do();
            }, 3000);
        }
        this.$player_tick.text(this.player_time);
        this.tick_func = setInterval(() => {
            this.player_time--;
            this.$player_tick.text(this.player_time);
            if(this.player_time === 0){
                this.clear_interval('tick');
                player.do();
            }
        }, 1000);
    }

    clear_interval(func_name = 'time'){
        if(func_name === 'time') clearInterval(this.time_func);
        else if(func_name === 'tick'){
            this.$pass_click.hide();
            this.$player_tick.empty();
            this.$player_tick.hide();
            this.player_time = this.playground.round_second;
            if(this.tick_func) clearInterval(this.tick_func);
        }
    }
    
    click_card_add_scale(){
        this.$click_card.find('.book').addClass('element-book');
        this.$click_card.find('.buy').addClass('element-book');
        this.$click_card.find('.cancle').addClass('element-book');
    }
    
    click_card_remove_scale(){
        if(this.$click_card.find('.buy').hasClass('element-book')) this.$click_card.find('.buy').removeClass('element-book');
        if(this.$click_card.find('.book').hasClass('element-book')) this.$click_card.find('.book').removeClass('element-book');
        if(this.$click_card.find('.cancle').hasClass('element-book')) this.$click_card.find('.cancle').removeClass('element-book');    
    }

    click_card_remove_no_click(){
        if(this.$click_card.find('.book').hasClass('no-click')) this.$click_card.find('.book').removeClass('no-click');
        if(this.$click_card.find('.buy').hasClass('no-click')) this.$click_card.find('.buy').removeClass('no-click');
    }

    click_card(card){
        let me = this.playground.players_manager.get_me();
        this.card = card;
        if(!this.card.can_book(me)) this.$click_card.find('.book').addClass('no-click');
        if(!this.card.can_buy(me)) this.$click_card.find('.buy').addClass('no-click');
        if(this.card.state === 'book'){
            this.click_card_add_scale();
            this.$click_card.css({'left': card.x + 150 * card.scale, 'top': card.y - 90});
        }
        else this.$click_card.css({'left': card.x + 150 * card.scale, 'top': card.y});
        this.$click_card.fadeIn();
    }

    add_error_message(val, x, y){
        this.$error_message.css({'left': x, 'top': y});
        this.$error_message.text(val);
        this.$error_message.show();
        this.$error_message.animate({top: (y - 50) + 'px'}, 'normal', 'linear');
        this.$error_message.fadeOut();
    }

    add_token_click(){
        this.$token_click.show();
    }

    change_game_score(player, score){
        let email = player.email;
        this.$game_score.find(`[name='${email}']`).text(score);
    }

    start() {
        this.add_listening_events();
    }
}
