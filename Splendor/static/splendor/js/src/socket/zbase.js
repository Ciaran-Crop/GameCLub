class SplendorRoomSocket {
    BASE_WSS = 'wss://app3774.acapp.acwing.com.cn';
    constructor(root){
        this.root = root;
        this.start();
    }

    start(){
        this.ws = new WebSocket(`${this.BASE_WSS}/wss/splendor/multiplayer/room/?token=` + localStorage.getItem('gc-access'));
        this.receive()
    }

    receive_create_room(content){
        this.root.room_id = content['room_id'];
        this.root.need_pass = content['need_pass'];
        this.root.receive_create_room(content['config']);
    }

    create_room(room_config){
        let content = {
            'room_config': room_config,
            'room_owner': this.root.player_info,
        }
        this.ws.send(JSON.stringify({
            'event': 'create_room',
            'content': content,
        }));
    }

    cancel_room(){
        this.ws.send(JSON.stringify({
            'event': 'cancel_room',
            'content': {'cancel_room': 'true'},
        }));
    }

    start_game(){
        this.ws.send(JSON.stringify({
            'event': 'start_game',
            'content': {'start_game': 'true'},
        }));
    }

    join_room(room_id, player_info, pass, match = 'false'){
        let content = {
            'room_id': room_id,
            'pass': pass,
            'player_info': player_info,
            'match': match,
        };
        this.ws.send(JSON.stringify({
            'event': 'join_room',
            'content': content,
        }));
    }

    receive_join_room(content){
        if(content['players'].length >= 2) this.root.start_game(content['config'], content['players'], content['room_id'])
    }

    receive_match_success(content){
        this.root.match_success(content);
    }

    stop_match(email, score){
        let content = {
            'email': email,
            'score': score,
        }
        this.ws.send(JSON.stringify({
            'event': 'stop_match',
            'content': content,
        }));
    }

    match(email, score){
        let content = {
            'email': email,
            'score': score,
        }
        this.ws.send(JSON.stringify({
            'event': 'match',
            'content': content,
        }));
    }

    receive(){
        this.ws.onmessage = (e) => {
            let data = JSON.parse(e.data);
            let event = data.event;
            let content = data.content;
            if(event === 'create_room'){
                this.receive_create_room(content);
            }else if(event === 'join_room'){
                if(content['match'] === 'false') this.root.room.receive_join_room(content['config'], content['players']);
                else this.receive_join_room(content);
            }else if(event === 'match_success'){
                this.receive_match_success(content)
            }else{
                if(data.email === this.root.player_info.email) return false;
                if(event === 'start_game'){
                    this.root.room.start_game();
                }else if(event === 'cancel_room'){
                    this.root.room.cancel_room();
                }else if(event === 'send_message'){
                    this.root.playground.socket.recevie_message(content);
                }else if(event === 'send_get_tokens'){
                    this.root.playground.socket.recevie_get_tokens(content);
                }else if(event === 'send_book_card'){
                    this.root.playground.socket.recevie_book_card(content);
                }else if(event === 'send_buy_card'){
                    this.root.playground.socket.receive_buy_card(content);
                }else if(event === 'send_pass'){
                    this.root.playground.socket.receive_pass(content);
                }
            }
        }
    }
}
