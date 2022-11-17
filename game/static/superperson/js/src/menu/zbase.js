class SPGameMenu {
    constructor(root) {
        this.root = root;
        this.$sp_game_menu = $(`
<div class="sp-game-menu">
    <div class="sp-game-menu-field">
        <div class="sp-game-menu-item sp-game-menu-item-single-mode">单人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-multi-mode">多人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-settings">退出</div>
    </div>
</div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_menu);

        this.$single_mode = this.$sp_game_menu.find('.sp-game-menu-item-single-mode');
        this.$multi_mode = this.$sp_game_menu.find('.sp-game-menu-item-multi-mode');
        this.$settings = this.$sp_game_menu.find('.sp-game-menu-item-settings')
        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        this.$single_mode.click(() => {
            this.hide();
            this.root.playground.show('single mode');
        });
        this.$multi_mode.click(() => {
            this.hide();
            this.root.playground.show('multi mode');
        });
        this.$settings.click(() => {
            localStorage.setItem(`superperson-access`, "");
            localStorage.setItem(`superperson-refresh`, "");

            if(this.root.login.platform === 'ACAPP'){
                this.root.os.api.window.close();
            }else{
                window.location.replace("https://app3774.acapp.acwing.com.cn/superperson/");
            }
        });
    }
    show(){
        this.back_img = this.root.login.back_img;
        this.$sp_game_menu.css("background-image","url(" + this.back_img + ")");
        this.$sp_game_menu.show();
    }

    hide(){
        this.$sp_game_menu.hide();
    }
}
