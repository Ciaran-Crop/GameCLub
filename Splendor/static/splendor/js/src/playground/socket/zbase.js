class SplendorGameSocket {
    BASE_WSS = 'wss://app3774.acapp.acwing.com.cn';
    constructor(playground){
        this.playground = playground;
        this.start();
    }

    start(){
        this.ws = this.playground.menu.socket.ws;
        console.log(this.ws);
    }

    get_player(email){
        return this.playground.players_manager.get_player(email);
    }

    get_card(card_uuid){
        return this.playground.cards_manager.get_card(card_uuid);
    }

    send_stat(content){
        this.ws.send(JSON.stringify({
            'event': 'send_stat',
            'content': content,
        }));
    }

    send_message(email, message){
        let content = {
            'email': email,
            'message': message,
        }
        this.ws.send(JSON.stringify({
            'event': 'send_message',
            'content': content,
        }));
    }

    send_get_tokens(email, tokens_config){
        let content = {
            'email': email,
            'tokens_config': tokens_config,
        }
        this.ws.send(JSON.stringify({
            'event': 'send_get_tokens',
            'content': content,
        }));
    }

    send_book_card(email, card_uuid){
        let content = {
            'email': email,
            'card_uuid': card_uuid,
        }
        this.ws.send(JSON.stringify({
            'event': 'send_book_card',
            'content': content,
        }));
    }

    send_buy_card(email, card_uuid){
        let content = {
            'email': email,
            'card_uuid': card_uuid,
        }
        this.ws.send(JSON.stringify({
            'event': 'send_buy_card',
            'content': content,
        }));
    }

    send_pass(email){
        let content = {
            'email': email,
        }
        this.ws.send(JSON.stringify({
            'event': 'send_pass',
            'content': content,
        }));
    }

    receive_pass(content){
        let email = content['email'];
        let p = this.get_player(email);
        p.pass(true);
    }

    recevie_message(content){
        let message = content['message'];
        let email = content['email'];
        this.playground.chat.send_message(email, message);
    }

    recevie_get_tokens(content){
        let email = content['email'];
        let tokens_config = content['tokens_config'];
        let p = this.get_player(email);
        this.playground.tokens_manager.picked_by_player_from_tokens(p, tokens_config);
        this.playground.players_manager.next_player();
    }

    recevie_book_card(content){
        let email = content['email'];
        let card_uuid = content['card_uuid'];
        let p = this.get_player(email);
        let c = this.get_card(card_uuid);
        c.book_by_player(p);
    }

    receive_buy_card(content){
        let email = content['email'];
        let card_uuid = content['card_uuid'];
        let p = this.get_player(email);
        let c = this.get_card(card_uuid);
        c.buy_by_player(p);
    }

}
