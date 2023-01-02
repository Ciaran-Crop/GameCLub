class AudioManager {
    constructor(playground){
        this.playground = playground;
        this.base_url = `/static/splendor/assets`;
        this.load_setting();
        this.pre_load_source();
        this.create_setting_element();
    }

    create_setting_element(){
        this.$playgound_setting = $(`
<div class='playground-setting'>
    <div class='playground-icon'></div>
    <div class='playground-setting-wrap'>
        <div class='playground-setting-box'>
            <div class='title'>
                <span>游戏设置</span>
                <img src='/static/gameclub/images/settings/cancel.svg'>
            </div>
            <div class='slider-box'>
                <div class='action-slider'>
                    <div class='name'>音乐设置</div>
                    <div id="backslider"></div>
                </div>
                <div class='action-slider'>
                    <div class='name'>音效设置</div>
                    <div id="actionslider"></div>
                </div>
            </div>
        </div>
    </div>
</div>
        `);
        this.$setting_icon = this.$playgound_setting.find('.playground-icon');
        this.$setting_wrap = this.$playgound_setting.find('.playground-setting-wrap');
        this.$setting_wrap.hide();
        this.playground.$playground_div.append(this.$playgound_setting);
        this.add_listening_event();
    }

    add_listening_event(){
        this.$setting_icon.on('click', () => {
            this.$setting_wrap.show();
        });
        this.$setting_wrap.find('.title > img').on('click', () => {
            this.$setting_wrap.hide();
        });
        this.$setting_wrap.find('#backslider').slider({
            value: this.setting['back_volume'],
            min:0,
            max:1,
            step: 0.01,
            range: "min",
            slider: () => {
                let v = this.$setting_wrap.find('#backslider').slider("value");
                this.save_setting('back_volume', v);
            },
            change: ()=>{
                let v = this.$setting_wrap.find('#backslider').slider("value");
                this.save_setting('back_volume', v);
            }
        });
        this.$setting_wrap.find('#actionslider').slider({
            value: this.setting['action_volume'],
            min:0,
            max:1,
            step: 0.01,
            range: "min",
            slider: () => {
                let v = this.$setting_wrap.find('#actionslider').slider("value");
                this.save_setting('action_volume', v);
            },
            change: ()=>{
                let v = this.$setting_wrap.find('#actionslider').slider("value");
                this.save_setting('action_volume', v);
                this.play_func.tac();
            }
        });
    }

    load_setting(){
        let setting_name = 'splendor_game_setting';
        let setting = localStorage.getItem(setting_name);
        if(setting){
            this.setting = JSON.parse(setting);
        }else{
            this.setting = {action_volume: 0.7, back_volume: 0.3};
        }
    }

    save_setting(name, value){
        let setting_name = 'splendor_game_setting';
        this.setting[name] = value;
        localStorage.setItem(setting_name, JSON.stringify(this.setting));
        this.change_setting(name, value);
    }

    change_setting(name ,value){
        if(name === 'back_volume'){
            this.back.volume(value);
        }else if(name === 'action_volume'){
            for(let index in this.action_sound){
                this.action_sound[index].volume(value);
            }
        }
    }

    pre_load_source(){
        let back_volume = this.setting['back_volume'];
        let action_volume = this.setting['action_volume'];
        this.back = new Howl({
            src: [this.base_url + '/back_sound.mp3'],
            volume: back_volume,
            loop: true,
            autoplay: true,
        });
        this.action_sound = [];
        this.get_use_token = new Howl({
            src: [this.base_url + '/get_use_token.ogg'],
            volume: action_volume,
        });
        this.move = new Howl({
            src: [this.base_url + '/move.ogg'],
            volume: action_volume,
        });
        this.move = new Howl({
            src: [this.base_url + '/move.ogg'],
            volume: action_volume,
        });
        this.select_token = new Howl({
            src: [this.base_url + '/select_token.ogg'],
            volume: action_volume,
        });
        this.splendor_buynoble = new Howl({
            src: [this.base_url + '/splendor_buynoble.ogg'],
            volume: action_volume,
        });
        this.splendor_ping = new Howl({
            src: [this.base_url + '/splendor_ping.ogg'],
            volume: action_volume,
        });
        this.tac = new Howl({
            src: [this.base_url + '/tac.ogg'],
            volume: action_volume,
        });
        this.action_sound.push(this.get_use_token);
        this.action_sound.push(this.move);
        this.action_sound.push(this.select_token);
        this.action_sound.push(this.splendor_buynoble);
        this.action_sound.push(this.splendor_ping);
        this.action_sound.push(this.tac);
        // usage: am.play_func.get_use_token();
        this.play_func = {
            get_use_token: () => {
                this.play(this.get_use_token);
            },
            move: () => {
                this.play(this.move);
            },
            select_token: () => {
                this.play(this.select_token);
            },
            splendor_buynoble: () => {
                this.play(this.splendor_buynoble);
            },
            splendor_ping: () => {
                this.play(this.splendor_ping);
            },
            tac: () => {
                this.play(this.tac);
            },
        };

    }

    play(obj){
        if(obj && obj.state() === 'loaded'){
            obj.play();
        }
    }
}