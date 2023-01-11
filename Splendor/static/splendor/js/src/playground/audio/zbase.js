class AudioManager {
    constructor(playground){
        this.playground = playground;
        this.base_url = `/static/splendor/assets`;
        this.audio_assets = this.playground.menu.loading.audio_assets;
        this.create_setting_element();
        this.play_func = this.audio_assets.play_func;
        this.play_func.back();
    }

    create_setting_element(){
        this.$playgound_setting = $(`
<div class='playground-setting'>
    <div class='playground-icon'></div>
    <div class='playground-setting-wrap'>
        <div class='playground-setting-box'>
            <div class='title'>
                <span>游戏设置</span>
                <img src='${BASE_URL}/static/gameclub/images/settings/cancel.svg'>
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
            value: this.get_setting('back_volume'),
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
            value: this.get_setting('action_volume'),
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

    get_setting(name){
        return this.audio_assets.get_setting(name);
    }
    save_setting(name, value){
        this.audio_assets.save_setting(name, value);
    }

    change_setting(name ,value){
        this.audio_assets.change_setting(name, value);
    }
}