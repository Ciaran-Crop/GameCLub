class Loading {
    constructor(menu) {
        this.load_total = 13;
        this.loaded = 0;
        this.menu = menu;
        this.loading_page();
        this.loading_start();
    }

    loading_page() {
        this.$script = $(`
<script src="${BASE_URL}/static/gameclub/js/dist/howler.min.js"></script>
        `);
        if(this.menu.os){
            this.menu.$menu_div.append(this.$script)
        }
        this.$loading_assets_page = $(`
<div class='loading_assets'>
    <div class='rubik-loader'>
    </div>
    <div class='loading-span'>
        <span>Loading assets... <span class='loading-stat'>${this.loaded}/${this.load_total}</span></span>
    </div>
</div>
        `);
        this.menu.$menu_div.append(this.$loading_assets_page);
    }

    loading_start() {
        this.change_loaded(-this.loaded);
        try {
            this.loading_audio();
            this.loading_image();
        } catch (error) {
            setTimeout(() => {
                this.loading_start();
            }, 1000);
        }
    }

    change_loaded(num) {
        this.loaded += num;
        this.$loading_assets_page.find('.loading-stat').text(`${this.loaded}/${this.load_total}`);
        if (this.loaded === this.load_total) {
            this.$loading_assets_page.fadeOut();
            this.menu.start();
        }
    }

    loading_audio() {
        let audio_assets = {
            base_url: `${BASE_URL}/static/splendor/assets`,
            setting: {},
            action_sound: [],
            loading_setting: () => {
                let setting_name = 'splendor_game_setting';
                let setting = localStorage.getItem(setting_name);
                if (setting) {
                    audio_assets.setting = JSON.parse(setting);
                } else {
                    audio_assets.setting = { action_volume: 0.5, back_volume: 0.2 };
                }
            },
            get_setting: (name) => {
                return audio_assets.setting[name];
            },
            save_setting: (name, value) => {
                let setting_name = 'splendor_game_setting';
                audio_assets.setting[name] = value;
                localStorage.setItem(setting_name, JSON.stringify(audio_assets.setting));
                audio_assets.change_setting(name, value);
            },
            change_setting: (name, value) => {
                if (name === 'back_volume') {
                    audio_assets.back.volume(value);
                } else if (name === 'action_volume') {
                    for (let index in audio_assets.action_sound) {
                        audio_assets.action_sound[index].volume(value);
                    }
                }
            },
            pre_load_source: () => {
                audio_assets.loading_setting();
                let back_volume = audio_assets.setting['back_volume'];
                let action_volume = audio_assets.setting['action_volume'];
                audio_assets.back = new Howl({
                    src: [audio_assets.base_url + '/back_sound.mp3'],
                    volume: back_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.get_use_token = new Howl({
                    src: [audio_assets.base_url + '/get_use_token.ogg'],
                    volume: action_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.move = new Howl({
                    src: [audio_assets.base_url + '/move.ogg'],
                    volume: action_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.move = new Howl({
                    src: [audio_assets.base_url + '/move.ogg'],
                    volume: action_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.select_token = new Howl({
                    src: [audio_assets.base_url + '/select_token.ogg'],
                    volume: action_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.splendor_buynoble = new Howl({
                    src: [audio_assets.base_url + '/splendor_buynoble.ogg'],
                    volume: action_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.splendor_ping = new Howl({
                    src: [audio_assets.base_url + '/splendor_ping.ogg'],
                    volume: action_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.tac = new Howl({
                    src: [audio_assets.base_url + '/tac.ogg'],
                    volume: action_volume,
                    onload: () => {
                        this.change_loaded(1);
                    }
                });
                audio_assets.action_sound.push(audio_assets.get_use_token);
                audio_assets.action_sound.push(audio_assets.move);
                audio_assets.action_sound.push(audio_assets.select_token);
                audio_assets.action_sound.push(audio_assets.splendor_buynoble);
                audio_assets.action_sound.push(audio_assets.splendor_ping);
                audio_assets.action_sound.push(audio_assets.tac);
                // usage: am.play_func.get_use_token();
                audio_assets.play_func = {
                    back: () => {
                        audio_assets.back.loop(true);
                        audio_assets.play(audio_assets.back);
                    },
                    get_use_token: () => {
                        audio_assets.play(audio_assets.get_use_token);
                    },
                    move: () => {
                        audio_assets.play(audio_assets.move);
                    },
                    select_token: () => {
                        audio_assets.play(audio_assets.select_token);
                    },
                    splendor_buynoble: () => {
                        audio_assets.play(audio_assets.splendor_buynoble);
                    },
                    splendor_ping: () => {
                        audio_assets.play(audio_assets.splendor_ping);
                    },
                    tac: () => {
                        audio_assets.play(audio_assets.tac);
                    },
                };
            },
            play: (obj) => {
                if (audio_assets.loaded(obj)) {
                    obj.play();
                }
            },
            loaded: (obj) => {
                if (obj && obj.state() === 'loaded') {
                    return true;
                }
                return false;
            },
            pause: () => {
                audio_assets.back.pause();
                for(let index = 0;index < audio_assets.action_sound.length;index++){
                    audio_assets.action_sound[index].splice(index, 1);
                }
            }
        }
        this.audio_assets = audio_assets;
        this.audio_assets.pre_load_source();
    }

    loading_image() {
        let image_assets = {
            base_url: `${BASE_URL}/static/splendor/assets`,
            texture_dict: { cards: null, gems: null, nobles: null, tokens: null, numbers_sheet: null },
            texture_image: {},
            pre_load: () => {
                for (let key in image_assets.texture_dict) {
                    let image = new Image();
                    let url = `${image_assets.base_url}/${key}.jpg`;
                    requestCORSIfNotSameOrigin(image, url);
                    image.src = url;
                    image.onload = () => {
                        this.change_loaded(1);
                    }
                    image_assets.texture_image[key] = image;
                }
            }
        }
        this.image_assets = image_assets;
        this.image_assets.pre_load();
    }
}