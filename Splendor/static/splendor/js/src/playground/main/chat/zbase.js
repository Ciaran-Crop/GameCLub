class SplendorChat {
    constructor(playground) {
        this.playground = playground;
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
        this.$chat_img.css('background', 'url('+ BASE_URL+'/static/splendor/images/playground/up_to.svg)');
        this.$chat_img.css('background-size', 'cover');
    }

    add_listening_events(){
        this.$history.on('mouseenter', () => {
            this.$history.fadeIn();
            this.$history.scrollTop(this.$history[0].scrollHeight);
            this.$input.hide();
            this.to_clear();
        }).on('mouseleave', () => {
            this.$history.hide();
            this.$input.hide();
            this.to_clear();
        });
        this.$chat_img.on('mouseenter', () => {
            this.$history.fadeIn();
            this.$history.scrollTop(this.$history[0].scrollHeight);
            this.$input.hide();
            this.to_clear();
        }).on('mouseleave', () => {
            this.$history.hide();
            this.$input.hide();
            this.to_clear();
        });
        this.playground.$canvas.keydown((e) => {
            if(e.which === 13){
                this.$input.show();
                this.$input.focus();
                this.$history.fadeIn();
                this.$history.scrollTop(this.$history[0].scrollHeight);
                this.$chat_img.hide();
            }else if(e.which === 27){
                this.$input.hide();
                this.$history.hide();
                this.$chat_img.show();
                this.playground.$canvas.focus();
                return false;
            }
        });
        this.$input.keydown((e) => {
            if(e.which === 27){
                this.$input.hide();
                this.$history.hide();
                this.$chat_img.show();
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
    }

    send_message(email, message) {
        this.to_has_message();
        let p = this.playground.players_manager.get_player(email);
        let name = p.name;
        message = `[${name}] ${message}`;
        this.$history.append(this.render_message(message, email));
        this.$history.scrollTop(this.$history[0].scrollHeight);
    }

    render_message(message, email){
        let me = this.playground.players_manager.get_me();
        if(email === me.email){
            return $(`<div style="color: LightPink">${message}</div>`);
        }
        return $(`<div style="color: red">${message}</div>`);
    }
}
