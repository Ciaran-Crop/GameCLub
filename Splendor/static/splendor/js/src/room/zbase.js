class SplendorRoom{
    constructor(root){
        this.root = root;
        this.players = [];
        this.start();
    }

    start(){
        this.create_base();
    }

    add_listening_events(){
        this.$room_wrap.find('.room-check-button > button').on('click', () => {
            let p = this.$room_wrap.find('.room-check-input > input').val();
            if(p === '') return false;
            this.check_pass(p);
        });
        this.$room_wrap.find('.room-start > button:first').on('click', () => {
            if(this.is_owner){
                if(this.players.length < 2) return false;
                this.root.socket.start_game();
            }
        });
        this.$room_wrap.find('.room-start > button:last').on('click', () => {
            if(this.is_owner){
                this.root.socket.cancel_room();
                this.cancel_room();
            }
        });
        this.$room_wrap.find('.room-start > button:nth-child(2)').on('click', (e) => {
            let copyipt = document.createElement("input");
            let text = `${BASE_URL}/splendor/page/menu/?room_id=${this.room_id}&need_pass=${this.need_pass}`;
            copyipt.setAttribute("value", text);
            document.body.appendChild(copyipt);
            copyipt.select();
            document.execCommand("copy");
            document.body.removeChild(copyipt);
            alert('复制链接成功, 分享给好友邀请加入游戏');
            // let copy = (e)=>{
            //     e.preventDefault();
            //     e.clipboardData.setData('text/plain',`${BASE_URL}/splendor/page/menu/?room_id=${this.room_id}&need_pass=${this.need_pass}`);
            //     alert('复制链接成功, 分享给好友邀请加入游戏');
            //     document.removeEventListener('copy',copy);
            // }
            // document.addEventListener('copy',copy);
            // document.execCommand("Copy");
        });
    }

    cancel_room(){
        window.location.href = `${BASE_URL}/splendor/`;
    }

    start_game(){
        this.root.start_game(this.config, this.players, this.room_id);
    }

    create_base(){
        this.$room_wrap = $(`
<div class='room-wrap'>
    <div class='room-check'>
        <div class='room-check-title'>
            <span>请输入房间密码</span>
        </div>
        <div class='room-check-input'>
            <input type='text' maxlength='4' oninput= "value = value.replace(/[^\\d]/g, '')" name='room_pass'>
        </div>
        <div class='room-check-button'>
            <button>确认</button>
        </div>
    </div>
    <div class='room-box'>
        <div class='room-title'>
            <span></span>
        </div>
        <div class='room-player'>
        </div>
        <div class='room-start'>
            <button>开始游戏</button>
            <button>邀请玩家</button>
            <button>解散房间</button>
        </div>
    </div>
</div>
`);
        this.$check = this.$room_wrap.find('.room-check');
        this.$check.hide();
        this.$box = this.$room_wrap.find('.room-box');
        this.$box.hide();
        this.$room_wrap.hide();
        this.root.$menu_div.append(this.$room_wrap);
        this.add_listening_events();
    }

    show(){
        this.$room_wrap.show();
    }

    hide(){
        this.$room_wrap.hide();
    }

    create_room(player_info, room_id, need_pass, is_owner, config){
        this.room_id = room_id;
        this.is_owner = is_owner;
        this.player_info = player_info;
        this.need_pass = need_pass;
        this.config = config;
        this.$room_wrap.css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + player_info.back + ')');
        if(is_owner){
            this.players.push(player_info);
            this.$box.find('.room-title > span').text('房间 ' + this.room_id + "(" + config['room_player_number'] + "人房)");
            this.padding_info(player_info);
            this.root.hide();
            this.show();
            this.$box.show();
        }else{
            this.root.hide();
            this.show();
            if(need_pass === 'true'){
                this.$check.show();
            }else{
                this.join_room(player_info, '');
            }
        }

    }

    check_pass(password){
        this.join_room(this.player_info, password);
    }

    join_room(player_info, pass){
        setTimeout(() => {
            this.root.socket.join_room(this.room_id, player_info, pass);
        }, 1000);
    }

    receive_join_room(config, players){
        this.config = config;
        this.$check.hide();
        // config
        this.playernumber = config['room_player_number'];
        this.round_second = config['room_round_second'];
        this.players = players;
        this.$box.find('.room-title > span').text('房间 ' + this.room_id + "(" + config['room_player_number'] + "人房)");
        this.$box.find('.room-player').empty();
        for(let i = 0;i < players.length;i++){
            this.padding_info(players[i]);
        }
        this.$box.show();
    }
    padding_info(player_info){
        let content = this.$box.find('.room-player');
        let element = $(`
<div class='player-element'>
    <div class='player-photo'>
        <img src='${player_info.photo}'>
    </div>
    <div class='player-name'>
        <span>${player_info.name}</span>
    </div>
</div>
`);
        content.append(element);
    }
}
