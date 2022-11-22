class MultiPlayerSocket {
    constructor(playground){
        this.playground = playground;
        this.ws = new WebSocket("wss://app3774.acapp.acwing.com.cn/wss/superperson/multiplayer/?token=" + localStorage.getItem('gc-access'));
        this.start();
    }
    start(){
        this.receive();
    }

    receive(){
        let outer = this;
        this.ws.onmessage = function(e){
            let data = JSON.parse(e.data);
            if(data.uuid === outer.uuid) return false;
            if(data.event === 'create_player'){
                outer.receive_create_player(data);
            }else if(data.event === 'move_to'){
                outer.receive_move_to(data);
            }else if(data.event === 'shoot_fireball'){
                outer.receive_shoot_fireball(data);
            }else if(data.event === 'attack'){
                outer.receive_attack(data);
            }else if(data.event === 'blink'){
                outer.receive_blink(data);
            }else if(data.event === 'send_message'){
                outer.receive_message(data);
            }
        };
    }

    send_create_player(x, y, username, photo){
        this.ws.send(JSON.stringify({
            'uuid': this.uuid,
            'x': x,
            'y': y,
            'event': 'create_player',
            'username' : username,
            'photo' : photo,
        }));
    }

    receive_create_player(data){
        let username = data['username'];
        let photo = data['photo'];
        let uuid = data['uuid'];
        let x = data['x'];
        let y = data['y'];
        let playground = this.playground;
        let player = new SPGamePlayer(playground, x, y, 'white', 0.25, 0.05, false, false, photo, username);
        playground.players.push(player);
        player.uuid = uuid;

    }

    send_move_to(tx, ty){
        this.ws.send(JSON.stringify({
            'uuid': this.uuid,
            'tx': tx,
            'ty': ty,
            'event': 'move_to',
        }));
    }

    receive_move_to(data){
        let uuid = data['uuid'];
        let tx = data['tx'];
        let ty = data['ty'];
        let player = this.get_player(uuid);
        if(player) player.move_to(tx,ty);
    }


    send_shoot_fireball(uuid,ball_uuid, tx, ty){
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': uuid,
            'ball_uuid': ball_uuid,
            'tx': tx,
            'ty': ty,
        }));
    }



    receive_shoot_fireball(data){
        let uuid = data['uuid'];
        let ball_uuid = data['ball_uuid'];
        let tx = data['tx'];
        let ty = data['ty'];
        let player = this.get_player(uuid);
        if(player){
            let fireball = player.unleash_skills(tx, ty, 'fireball');
            fireball.uuid = ball_uuid;
        }

    }

    send_attack(attacker_uuid, attackee_uuid, ball_uuid, angle, damage, x, y){
        this.ws.send(JSON.stringify({
            'event': 'attack',
            'x': x,
            'y': y,
            'damage' : damage,
            'angle': angle,
            'ball_uuid': ball_uuid,
            'attackee_uuid': attackee_uuid,
            'uuid': attacker_uuid,
        }));
    }

    receive_attack(data){
        let x = data['x'];
        let y = data['y'];
        let damage = data['damage'];
        let angle = data['angle'];
        let ball_uuid = data['ball_uuid'];
        let attacker_uuid = data['uuid'];
        let attackee_uuid = data['attackee_uuid'];
        let attacker = this.get_player(attacker_uuid);
        let attackee = this.get_player(attackee_uuid);
        if(attacker && attackee){
            let fireball = attacker.get_fireball(ball_uuid);
            fireball.receive_attack(angle, damage, x, y, attackee);
        }
    }

    send_blink(uuid, blink_uuid, tx, ty){
        this.ws.send(JSON.stringify({
            'event': 'blink',
            'uuid': uuid,
            'blink_uuid': blink_uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(data){
        let player = this.get_player(data['uuid']);
        let tx = data['tx'];
        let ty = data['ty'];
        if(player){
            player.x = tx;
            player.y = ty;
        }
    }

    send_message(username, text){
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': 'send_message',
            'uuid': outer.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_message(data){
        let username = data['username'];
        let text = data['text'];
        this.playground.chat.add_message(username, text);
    }


    get_player(uuid){
        let players = this.playground.players;
        for(let i = 0; i < players.length;i++){
            if(players[i].uuid === uuid){
                return players[i];
            }
        }
    }

}
