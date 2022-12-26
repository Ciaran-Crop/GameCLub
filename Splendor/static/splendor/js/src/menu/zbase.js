export class SplendorMenu {
    constructor(id, os, room_id, need_pass){
        this.id = id;
        this.os = os;
        this.room_id = room_id;
        this.need_pass = need_pass
        this.$menu_div = $('#' + this.id);
        this.start();
    }

    start(){
        this.start_ws();
        this.start_room();
        this.get_info();
        this.create_settings();
    }

    start_ws(){
        this.socket = new SplendorRoomSocket(this);
    }

    start_room(){
        this.room = new SplendorRoom(this);
    }

    create_settings(){
        this.single_setting = {
            'single_mode': {'name': '模式', 'content': ['单人']},
            'single_player_number': {'name': '人数', 'content': ['2人','3人','4人']},
        };
        this.room_setting = {
            'room_mode': {'name': '模式', 'content': ['多人']},
            'room_player_number': {'name': '人数', 'content':['2人', '3人', '4人']},
            'room_round_second': {'name': '回合秒数', 'content': ['10s', '15s', '30s', '35s']},
            'room_pass': {'name':'房间密码', 'content': ['none']},
        };
    }

    create_element(){
        // base_wrap
        this.$base_wrap = $(`
<div class='menu-wrap'>
    <div class='menu-player-info'>
        <div class='player-info'>
            <div class='player-info-left'>
                <span></span>
                <span></span>
            </div>
            <div class='player-info-right'>
                <img>
            </div>
        </div>
    </div>
    <div class='menu-box'>
    </div>
</div>
`);
        if(this.room_id){
            this.room.create_room(this.player_info, this.room_id, this.need_pass, false, null);
        }
        this.$player_name = this.$base_wrap.find('.player-info-left > span:first');
        this.$player_score = this.$base_wrap.find('.player-info-left > span:last');
        this.$player_photo = this.$base_wrap.find('.player-info-right > img');
        this.$menu_box = this.$base_wrap.find('.menu-box');

        this.$menu_div.append(this.$base_wrap);

        // menu wrap
        this.$base_menu = $(`
<div class='menu-list' name='base-menu'>
    <div class='menu-element' name='single'>
        <span>单人游戏</span>
    </div>
    <div class='menu-element' name='multi'>
        <span>多人游戏</span>
    </div>
    <div class='menu-element' name='ranklist'>
        <span>排行榜</span>
    </div>
    <div class='menu-element' name='signout'>
        <span>退出</span>
    </div>
</div>
`);
        this.$single = this.$base_menu.find("[name='single']");
        this.$multi = this.$base_menu.find("[name='multi']");
        this.$rank = this.$base_menu.find("[name='ranklist']");
        this.$signout = this.$base_menu.find("[name='signout']");

        this.$menu_box.append(this.$base_menu);

        // single menu
        this.$single_setting = $(`
<div class='menu-setting-wrap'>
    <div class='menu-setting-box'>
        <div class='menu-setting-title'>
            <span>单人设定</span>
        </div>
        <div class='menu-setting-config'>
            <div class='menu-setting-content'>
            </div>
        </div>
        <div class='menu-setting-button'>
            <button>确定</button>
            <button>取消</button>
        </div>
    </div>
</div>
`);
        // something
        this.$single_setting_content = this.$single_setting.find('.menu-setting-content');
        this.contain_setting(this.$single_setting_content, this.single_setting);
        this.$single_check_button = this.$single_setting.find('button:first');
        this.$single_cancel_button = this.$single_setting.find('button:last');

        this.$single_setting.hide();
        this.$menu_box.append(this.$single_setting);

        // multi menu
        this.$multi_list = $(`
<div class='menu-list' name='multi-menu'>
    <div class='menu-element' name='match'>
        <span>开始匹配</span>
    </div>
    <div class='menu-element' name='create_room'>
        <span>组队房间</span>
    </div>
    <div class='menu-element' name='multi-last'>
        <span>上一级</span>
    </div>
</div>
`);

        this.$match_loading = $(`
<div class='match-loading'>
    <div class="rubik-loader"></div>
    <div></div>
    <button>取消匹配</button>
</div>
`);

        this.$match = this.$multi_list.find("[name='match']");
        this.$create_room = this.$multi_list.find("[name='create_room']");
        this.$multi_last_menu = this.$multi_list.find("[name='multi-last']");

        this.$multi_list.hide();
        this.$menu_box.append(this.$multi_list);
        this.$menu_box.append(this.$match_loading);

        // room setting
        this.$create_room_setting = $(`
<div class='menu-setting-wrap'>
    <div class='menu-setting-box'>
        <div class='menu-setting-title'>
            <span>房间设定</span>
        </div>
        <div class='menu-setting-config'>
            <div class='menu-setting-content'>
            </div>
        </div>
        <div class='menu-setting-button'>
            <button>创建房间</button>
            <button>取消</button>
        </div>
    </div>
</div>
`);

        // something
        this.$room_setting_content = this.$create_room_setting.find('.menu-setting-content');
        this.contain_setting(this.$room_setting_content, this.room_setting);
        this.$room_check_button = this.$create_room_setting.find('button:first');
        this.$room_cancel_button = this.$create_room_setting.find('button:last');

        this.$create_room_setting.hide();
        this.$menu_box.append(this.$create_room_setting);

        // ranklist wrap
        this.$ranklist = $(`
<div class='menu-ranklist-wrap'>
    <div class='menu-ranklist-box'>
        <div class='ranklist-title'>
            <span>排行榜</span>
            <img src="/static/gameclub/images/settings/cancel.svg">
        </div>
        <div class='ranklist-box'>
            <div class="rubik-loader"></div>
            <div class="ranklist-content-row ranklist-content-header">
                <span>排名</span>
                <span>头像</span>
                <span>昵称</span>
                <span>分数</span>
            </div>
            <div class='ranklist-content'>
            </div>
        </div>
        <div class="ranklist-content-row ranklist-content-me">
        </div>
    </div>
</div>
`);

        this.$ranklist_content = this.$ranklist.find('.ranklist-content');
        this.$ranklist_cancel = this.$ranklist.find('img');
        this.$rubik_loader = this.$ranklist.find('.rubik-loader');
        this.$ranklist_row_me = this.$ranklist.find('.ranklist-content-me');

        this.$ranklist.hide();
        this.$menu_box.append(this.$ranklist);
        $(".menu-setting-select-box").buttonset();
        this.add_listening_events();
    }

    add_listening_events(){
        // base_menu
        this.$single.on('click', () => {
            this.$base_menu.hide();
            this.$single_setting.show();
        });
        this.$multi.on('click', () => {
            this.$base_menu.hide();
            this.$multi_list.show();
        });
        this.$rank.on('click', () => {
            this.$base_menu.hide();
            this.show_ranklist();
        });
        this.$signout.on('click', () => {
            clear_tokens();
            window.location.reload();
        });
        this.$single_check_button.on('click', () => {
            let config = this.get_config(this.$single_setting_content);
            this.start_single_game(config);
        });
        this.$single_cancel_button.on('click', () => {
            this.$single_setting.hide();
            this.$base_menu.show();
        });
        this.$room_check_button.on('click', () => {
            let config = this.get_config(this.$room_setting_content);
            this.create_room(config);
        });
        this.$room_cancel_button.on('click', () => {
            this.$create_room_setting.hide();
            this.$multi_list.show();
        });
        this.$match.on('click', () => {
            this.$multi_list.hide();
            this.$match_loading.show();
            this.time_func_id = this.start_match_timing();
            this.match_game(this.player_info);
        });
        this.$match_loading.find('button').on('click', () => {
            this.stop_match();
            this.$multi_list.show();
        });
        this.$create_room.on('click', () => {
            this.$multi_list.hide();
            this.$create_room_setting.show();
        });
        this.$multi_last_menu.on('click', () => {
            this.$multi_list.hide();
            this.$base_menu.show();
        });
        this.$ranklist_cancel.on('click', () => {
            this.$ranklist.hide();
            this.$base_menu.show();
        });
    }

    create_room(config){
        this.socket.create_room(config);
    }

    receive_create_room(config){
        this.room.create_room(this.player_info, this.room_id, this.need_pass, true, config);
    }

    match_success(content){
        this.stop_match_timing(this.time_func_id);
        this.$match_loading.find('button').hide();
        this.$match_loading.find('div:last').css('color', 'rgb(68, 157, 68)');
        this.$match_loading.find('div:last').text('匹配成功! loading...');
        this.socket.join_room(content['room_id'], this.player_info, content['pass'], 'true')
        console.log('match_success');
    }

    start_game(config, players, room_id){
        let player = null;
        for(let i = 0;i < players.length;i++){
            if(players[i].email === this.email){
                players[i]['character'] = 'me';
                player = players[i];
            }else{
                players[i]['character'] = 'enemy';
            }
        }
        console.log('start_game', config, players, room_id);
        this.playground = new SplendorPlayground(this, config, players, room_id, player);
        this.room.hide();
        this.hide();
    }

    stop_game() {
        if(this.playground){
            this.playground.close();
            this.playground = null;
            this.show();
        }
    }

    stop_match_timing(func_id){
        clearInterval(func_id);
    }

    start_match_timing(){
        let i = 1;
        this.$match_loading.find('div:last').text('');
        return setInterval(() => {
            let temp = i;
            let second = temp % 60;
            let min = Math.floor(temp / 60);
            let mess = '匹配中... ';
            if(min > 0) mess += (min + 'm');
            mess += (second + 's');
            this.$match_loading.find('div:last').text(mess);
            i += 1;
        }
            , 1000);
    }

    stop_match(){
        this.stop_match_timing(this.time_func_id);
        this.socket.stop_match(this.email, this.score);
        this.$match_loading.hide();
        console.log('stop_match');
    }

    match_game(info){
        console.log('matching...', info);
        this.socket.match(info.email, info.score);
    }

    show_ranklist(){
        this.$ranklist.show();
        if(this.rank_list){
            this.$rubik_loader.hide();
            this.$ranklist_content.show();
            this.$ranklist_row_me.show();
        }else{
            this.get_ranklist();
        }
    }

    get_ranklist(){
        $.ajax({
            url: `${BASE_URL}/splendor/auth/get_ranklist/`,
            type: 'post',
            headers : {
                'Authorization': 'Bearer ' + localStorage.getItem('gc-access'),
            },
            data : {
                'range_min': 1,
                'range_max': 100,
            },
            success : rep => {
                this.padding_ranklist(rep);
                if(this.$ranklist.css('display') !== 'none'){
                    this.$rubik_loader.hide();
                    this.$ranklist_content.show();
                    this.$ranklist_row_me.show();
                }
            },
        });
    }

    padding_ranklist(rep){
        let me_rank = -1;
        let ranks = rep.content;
        this.rank_list = ranks;
        let length = ranks.length;
        ranks.forEach((value, index, array) => {
            let ranknumber = index + 1;
            let photo = value.photo;
            let name = value.name;
            let score = value.score;
            let email = value.email;
            let element = this.create_ranklist_row(ranknumber, photo, name, score);
            if(ranknumber === 1){
                element.addClass('ranklist-content-first');
            }
            if(ranknumber === 2){
                element.addClass('ranklist-content-second');
            }
            if(ranknumber === 3){
                element.addClass('ranklist-content-third');
            }
            if(ranknumber === length){
                element.addClass('ranklist-content-last-row');
            }
            if(this.email === email){
                me_rank = ranknumber;
                element.addClass('ranklist-content-box-me');
            }
            this.$ranklist_content.append(element);
        });
        if(me_rank === -1) me_rank = '未上榜';
        this.$ranklist_row_me.append($(`
<span>${me_rank}</span>
<img src='${this.photo}'>
<span>${this.name}</span>
<span>${this.score}</span>
`));
    }

    create_ranklist_row(ranknumber, photo, name, score){
        let ranklist_row = $(`
<div class="ranklist-content-row">
    <span>${ranknumber}</span>
    <img src='${photo}'>
    <span>${name}</span>
    <span>${score}</span>
</div>
`);
        return ranklist_row;
    }

    contain_setting(ele, setting){
        for(let index in setting){
            let key = index;
            let value = setting[key];
            let name = value['name'];
            let selects = value['content'];
            ele.append(this.create_setting_config_element(key, name, selects));
        }
    }

    get_config(ele){
        let elements = ele.children('div');
        let config = {};
        for(let i = 0; i < elements.length;i++){
            let element = $(elements[i]);
            let name = element.find('input')[0].name;
            let val = '';
            if(name === 'room_pass') val = element.find('input').val();
            else val = element.find('input:checked').val();
            config[name] = val;
        }
        return config;

    }

    start_single_game(config){
        let playernumber = parseInt(config['single_player_number'][0]);
        config['single_player_number'] = playernumber;
        let players = [];
        let me = this.player_info;
        me['game_score'] = 0;
        me['character'] = 'me';
        players.push(me);
        for(let i = 1;i < playernumber;i++){
            players.push({
                'email': 'robot' + i,
                'name': 'robot' + i,
                'score': this.player_info.score,
                'photo': `/media/default/user.jpg`,
                'game_score': 0,
                'character': 'robot',
            });
        }
        console.log('start_single_game', config, players);
        this.playground = new SplendorPlayground(this, config, players, 'splendor-room_single', me);
        this.room.hide();
        this.hide();
    }

    padding_info(rep){
        this.player_info = rep;
        this.name = rep.name;
        this.email = rep.email;
        this.photo = rep.photo;
        this.score = rep.score;
        this.back = rep.back;
        this.create_element();
        this.$player_name.text(this.name);
        this.$player_score.text('Score: ' + this.score);
        this.$player_photo.attr('src', this.photo);
        this.$base_wrap.css('background-image', 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + this.back + ')');
    }

    get_info(){
        $.ajax({
            url: `${BASE_URL}/splendor/auth/get_info/`,
            type: 'post',
            headers : {
                'Authorization': 'Bearer ' + localStorage.getItem('gc-access'),
            },
            success: rep => {
                this.padding_info(rep);
                refresh_tokens();
            },
            error: () => {
                window.location.href = `${BASE_URL}`
            }
        });
    }

    show(){
        this.$base_wrap.show();
    }

    hide(){
        this.$base_wrap.hide();
    }

    create_setting_config_element(config_name_input, config_name, config_selects){
        let setting_config_element = $(`
<div class='menu-setting-element'>
    <div class='menu-setting-name'>
        <span>${config_name}</span>
        <span>:</span>
    </div>
    <div class='menu-setting-select'>
        <div class='menu-setting-select-box'>
        </div>
    </div>
</div>
`);
        if(config_name === '房间密码'){
            let password_input = $(`
<input type='text' maxlength='4' oninput = "value=value.replace(/[^\\d]/g,'')" name='room_pass'>
<span>(不填视为不设置密码)</span>
`);
            setting_config_element.find('.menu-setting-select-box').append(password_input);
        }else{
            config_selects.forEach((value, index, array) => {
                let button_radio = $(`
<input type="radio" id="${config_name_input}${index}" value='${value}' name="${config_name_input}"><label for="${config_name_input}${index}">${value}</label>
`);
                if(index === 0){
                    button_radio.attr('checked', 'true');
                }
                setting_config_element.find('.menu-setting-select-box').append(button_radio);
            });
        }

        return setting_config_element;
    }
}
