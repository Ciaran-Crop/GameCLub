class SPGameMenu {
    constructor(root) {
        this.root = root;
        this.$sp_game_menu = $(`
<div class="sp-game-menu">
    <div class="sp-game-menu-field">
        <div class="sp-game-menu-item sp-game-menu-item-single-mode">单人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-multi-mode">多人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-settings">设置</div>
    </div>
</div>
`);
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
        let outer = this;
        this.$single_mode.click(function(){
            console.log("click single mode");
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
    }
    show(){
        this.$sp_game_menu.show();
    }

    hide(){
        this.$sp_game_menu.hide();
    }
}
