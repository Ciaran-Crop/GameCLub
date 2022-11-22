class SPGameLogin{
    constructor(root, os){
        this.root = root;
        this.platform = "WEB";
        if(this.root.os){
            this.platform = "ACAPP";
        }
        this.$sp_index_page = $(`
<div class="sp-index-page">
    <div class="sp-login-page">
        <div class="sp-login-title">
            登录 GameClub
        </div>
        <div class = 'sp-login-url'>
            <button>前往登录</button>
        </div>
        </div>
    </div>
</div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_index_page);
        this.$sp_login_page= this.$sp_index_page.find('.sp-login-page');
        this.$sp_login_page.hide();
        this.$sp_login_to = this.$sp_login_page.find('.sp-login-url');

        this.photo = '';
        this.back_img = '';
        this.start();
    }
    start(){
        if(this.platform === 'ACAPP'){
            this.acapp_getinfo();
        }else {
            this.get_info();
            this.add_listening_events_login();
        }
    }

    add_listening_events_login(){
        this.$sp_login_to.on('click', () => {
            window.location.href = 'https://app3774.acapp.acwing.com.cn/?redirect=https://app3774.acapp.acwing.com.cn/superperson/';
        })
    }

    refresh_jwt_interval(){
        // refresh access
        setInterval(() => {
            $.ajax({
                url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/api/token/refresh',
                type: 'post',
                data: {
                     "refresh": localStorage.getItem(`gc-refresh`),
                },
                success: rep => {
                    localStorage.setItem(`gc-access`, rep.access);
                },
            });
        }, 4.5 * 60 * 1000);

    }


    login(){
        this.show();
        this.$sp_login_page.show();
    }


    acapp_login(appid, redirect_uri, scope, state){
        let outer = this;
        outer.root.os.api.oauth2.authorize(appid, redirect_uri, scope, state, rep => {
            if(rep.result === 'success'){
                outer.username = rep.username;
                outer.photo = "https://app3774.acapp.acwing.com.cn" + rep.photo;
                outer.back_img = "https://app3774.acapp.acwing.com.cn" + rep.back_img;
                localStorage.setItem(`gc-access`, rep.access);
                localStorage.setItem(`gc-refresh`, rep.refresh);
                outer.hide();
                outer.root.menu.show();
                this.refresh_jwt_interval();
            }
        });
    }

    acapp_getinfo(){
        let outer = this;
        $.ajax({
            url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/acwing/acwing/apply_code/',
            type: 'GET',
            success: function(rep){
                if(rep.result === 'success'){
                    let appid = rep.appid;
                    let redirect_uri = rep.redirect_uri;
                    let scope = rep.scope;
                    let state = rep.state;
                    outer.acapp_login(appid, redirect_uri, scope, state);
                }
            }
        });
    }

    get_ranklist(){
        $.ajax({
            url : 'https://app3774.acapp.acwing.com.cn/superperson/settings/get_ranklist/',
            type: 'get',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(`gc-access`),
            },
            success : rep => {
                console.log(rep);
            }
        });
    }

    get_info(){
        $.ajax({
            url : 'https://app3774.acapp.acwing.com.cn/superperson/settings/get_info/',
            type : 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(`gc-access`),
            },
            success : rep => {
                this.username = rep.username;
                this.photo = rep.photo;
                this.back_img = rep.back_img;
                this.hide();
                this.root.menu.show();

            },
            error : () => {
                this.login();
            }
        });
    }

    hide(){
        this.$sp_index_page.hide();
    }

    show(){
        this.$sp_index_page.show();
    }
}
