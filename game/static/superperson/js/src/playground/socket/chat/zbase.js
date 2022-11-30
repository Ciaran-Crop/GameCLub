class SPGameChatField {
    constructor(playground) {
        this.playground = playground;

        this.$history = $(`
<div class="sp-game-chat-field-history">

</div>
`);
        this.$input = $(`
<input type='text' class="sp-game-chat-field-input">
`);

        this.hide_input();
        this.hide_history();
        this.func_id = null;
        this.playground.$sp_game_playground.append(this.$history);
        this.playground.$sp_game_playground.append(this.$input);
        this.start();

    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$input.on('contextmenu', function(){return false});
        this.$history.on('contextmenu', function(){return false});
        this.$input.keydown(function(e){
            if(e.which === 27){
                outer.hide_input();
                return false;
            }else if(e.which === 13){
                let email = outer.playground.root.login.email;
                let name = outer.playground.root.login.name;
                let text = outer.$input.val();
                if(text){
                    outer.$input.val("");
                    outer.add_message(name, email ,text);
                    outer.playground.mps.send_message(name,email,text);
                }
                return false;
            }

        });

    }

    render_message(message, name, email){
        if(email === this.playground.root.login.email){
            return $(`<div style="color: LightPink">${message}</div>`);
        }
        return $(`<div>${message}</div>`);
    }

    add_message(name, email, text){
        this.show_history();
        let message = `[${name}] ${text}`;
        this.$history.append(this.render_message(message, name, email));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    show_input(){
        this.show_history();
        this.$input.show();
        this.$input.focus();
    }

    hide_input(){
        this.$input.hide();
        this.playground.sp_game_map.$canvas.focus();
    }

    show_history(){
        this.$history.fadeIn();
        let outer = this;
        if(this.func_id) clearTimeout(this.func_id);

        this.func_id = setTimeout(function(){
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 3000);
    }

    hide_history(){
        this.$history.fadeOut();
    }

}
