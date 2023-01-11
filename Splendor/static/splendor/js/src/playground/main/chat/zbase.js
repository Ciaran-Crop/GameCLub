class SplendorChat {
    constructor(playground) {
        this.playground = playground;
        this.am = this.playground.am;
        this.chat_state = false;
        this.start();
    }
    start() {
        this.$history = $(`
        <div class="chat-history">
        
        </div>
        `);
        this.$input = $(`
        <input type='text' class="chat-input">
        
        `);
        this.$chat_img = $(`<div class='chat-img'></div>`);
        this.playground.$playground_div.append(this.$history);
        this.playground.$playground_div.append(this.$input);
        this.playground.$playground_div.append(this.$chat_img);
        this.add_listening_events();
    }

    to_clear(){
        this.$chat_img.css('background', 'url('+ BASE_URL +'/static/splendor/images/playground/up.svg)');
        this.$chat_img.css('background-size', 'cover');
    }

    to_has_message(){
        if(this.$history.css('display') === 'block'){
            return false;
        }
        this.$chat_img.css('background', 'url('+ BASE_URL+'/static/splendor/images/playground/up_to.svg)');
        this.$chat_img.css('background-size', 'cover');
    }

    add_listening_events(){
        this.$chat_img.on('click', () => {
            if(!this.chat_state){
                this.chat_state = true;
                this.$history.fadeIn();
                this.$history.scrollTop(this.$history[0].scrollHeight);
                this.$chat_img.addClass("chat-img-rotate");
                this.to_clear();
            }else{
                this.chat_state = false;
                this.$history.hide();
                this.$chat_img.removeClass("chat-img-rotate");
                this.to_clear();
            }
            return false;
        });
        this.playground.$canvas.keydown((e) => {
            if(e.which === 13){
                this.$input.focus();
                return false;
            }
        });
        this.$input.keydown((e) => {
            if(e.which === 27){
                this.playground.$canvas.focus();
                return false;
            }else if(e.which === 13){
                let p = this.playground.players_manager.get_me();
                let email = p.email;
                let text = this.$input.val();
                if(text){
                    this.$input.val("");
                    this.send_message(email ,text);
                    if(this.playground.socket) this.playground.socket.send_message(email, text);
                }
                return false;
            }
        });

        this.playground.$canvas.focus(() => {
            this.focus_canvas();
            return false;
        });
        this.$input.focus(() => {
            this.focus_input();
            return false;
        }).blur(() => {
            this.playground.$canvas.focus();
            return false;
        });
    }

    focus_input(){
        this.$history.fadeIn();
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    focus_canvas(){
        this.$history.hide();
    }

    send_message(email, message) {
        this.to_has_message();
        let p = this.playground.players_manager.get_player(email);
        let name = p.name;
        message = `[${name}] ${message}`;
        this.$history.append(this.render_message(message, email));
        this.$history.scrollTop(this.$history[0].scrollHeight);
        if(email !== this.playground.players_manager.get_me().email){
            this.am.play_func.tac();
        }
    }

    render_message(message, email){
        let me = this.playground.players_manager.get_me();
        if(email === me.email){
            return $(`<div style="color: LightPink">${message}</div>`);
        }
        return $(`<div style="color: red">${message}</div>`);
    }
}
