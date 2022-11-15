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
            登录
        </div>
        <div class="sp-login-item">
            <div class="sp-login-username-input">
                <input type='text' placeholder="请输入用户名">
            </div>
        </div>
        <div class="sp-login-item">
            <div class="sp-login-password-input">
                <input type='password' placeholder="请输入密码">
            </div>
        </div>
        <div class="sp-login-item">
            <button class="sp-login-button">登录</button>
        </div>
        <div class="sp-login-error-message">
        </div>
        <div class="sp-login-to-register">
            注册
        </div>
        <br>
        <div class="sp-login-other">
            <div class="sp-login-other-logo">
                <img width="30" height='30' src="https://app3774.acapp.acwing.com.cn/static/superperson/images/settings/acapp.jpg">
            </div>
            <div class="sp-login-other-font">
                ACWing登录
            </div>
        </div>
    </div>
    <div class="sp-register-page">
        <div class="sp-login-title">
            注册
        </div>
        <div class="sp-login-item">
            <div class="sp-register-username-input">
                <input type='text' placeholder='请输入用户名'>
            </div>
        </div>
        <div class="sp-login-item">
            <div class="sp-register-password-input">
                <input type='password' placeholder='请输入密码'>
            </div>
        </div>
        <div class="sp-login-item">
            <div class="sp-register-password-confirm-input">
                <input type='password' placeholder='请再次输入密码'>
            </div>
        </div>
        <div class="sp-login-item">
            <button class="sp-register-button">注册</button>
        </div>
        <div class="sp-register-error-message">
        </div>
        <div class="sp-login-to-login">
                登录
        </div>
    </div>
</div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_index_page);
        this.$sp_login_page = this.$sp_index_page.find('.sp-login-page');
        this.$sp_register_page = this.$sp_index_page.find('.sp-register-page');
        this.$sp_login_page.hide();
        this.$sp_register_page.hide();
        // login
        this.$sp_login_button = this.$sp_index_page.find('.sp-login-button');
        this.$sp_login_username = this.$sp_index_page.find('.sp-login-username-input > input');
        this.$sp_login_password = this.$sp_index_page.find('.sp-login-password-input > input');
        this.$sp_login_to_register = this.$sp_index_page.find('.sp-login-to-register');
        this.$sp_login_error_message = this.$sp_index_page.find('.sp-login-error-message');
        this.$sp_login_acapp = this.$sp_index_page.find('.sp-login-other-logo > img');

        // register
        this.$sp_register_button = this.$sp_index_page.find('.sp-register-button');
        this.$sp_register_username = this.$sp_index_page.find('.sp-register-username-input > input');
        this.$sp_register_password = this.$sp_index_page.find('.sp-register-password-input > input');
        this.$sp_register_password_confirm = this.$sp_index_page.find('.sp-register-password-confirm-input > input');
        this.$sp_login_to_login = this.$sp_index_page.find('.sp-login-to-login');
        this.$sp_register_error_message = this.$sp_index_page.find('.sp-register-error-message');

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
            this.add_listening_events_register();
        }
    }

    add_listening_events_login(){
        let outer = this;
        this.$sp_login_username.click(function(){
            outer.$sp_login_error_message.empty();
        });
        this.$sp_login_password.click(function(){
            outer.$sp_login_error_message.empty();
        });
        this.$sp_login_to_register.click(function(){
            outer.register();
        });
        this.$sp_login_button.click(function(){
            outer.remote_login();
        });
        this.$sp_login_acapp.click(function(){
            outer.login_acapp();
        });
    }

    add_listening_events_register(){
        let outer = this;
        this.$sp_register_username.click(function(){
            outer.$sp_register_error_message.empty();
        });
        this.$sp_register_password.click(function(){
            outer.$sp_register_error_message.empty();
        });
        this.$sp_register_password_confirm.click(function(){
            outer.$sp_register_error_message.empty();
        });
        this.$sp_login_to_login.click(function(){
            outer.login();
        });
        this.$sp_register_button.click(function(){
            outer.remote_register();
        });
    }
    getCookie(name){
        let value = '';
        if(document.cookie && document.cookie !== ''){
            let cookies = document.cookie.split(';');
            for(let i = 0;i < cookies.length;i++){
                let cookie = cookies[i].trim();
                if(cookie.substring(0,name.length + 1) == (name + '=')){
                    value = decodeURIComponent(cookie.substring(name.length + 1));
                }
            }
        }
        return value;
    }

    refresh_jwt_interval(){
        // refresh access
        setInterval(() => {
            $.ajax({
                url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/api/token/refresh',
                type: 'post',
                data: {
                     "refresh": localStorage.getItem(`superperson-refresh`),
                },
                success: rep => {
                    localStorage.setItem(`superperson-access`, rep.access);
                },
            });
        }, 4.5 * 60 * 1000);

    }

    remote_login(un, pd){
        const username = un || this.$sp_login_username.val();
        const password = pd || this.$sp_login_password.val();
        $.ajax({
            url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/api/token/',
            type: 'post',
            data: {
                'username': username,
                'password': password,
            },
            success: rep => {
                localStorage.setItem(`superperson-access`, rep.access);
                localStorage.setItem(`superperson-refresh`, rep.refresh);
                this.get_info();
                this.refresh_jwt_interval();
            },
            error: () => {
                this.$sp_login_error_message.html("用户名或密码错误");
            }
        });
    }

    login_acapp(){
        $.ajax({
            url: "https://app3774.acapp.acwing.com.cn/superperson/settings/web/acwing/apply_code/",
            type: 'GET',
            success: function(rep){
                if(rep.result === 'success'){
                    window.location.replace(rep.url);
                }
            }
        });
    }

    remote_register(){
        let outer = this;
        const username = this.$sp_register_username.val();
        const password = this.$sp_register_password.val();
        const password_confirm = this.$sp_register_password_confirm.val();
        $.ajax({
            url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/register/',
            type: 'POST',
            data: {
                'username': username,
                'password': password,
                'password_confirm': password_confirm,
            },
            success: rep => {
                if(rep.result === 'success'){
                    this.remote_login(username, password);
                }else{
                    outer.$sp_register_error_message.html(rep.text);
                }

            }
        });
    }

    login(){
        this.show();
        this.$sp_register_page.hide();
        this.$sp_login_page.show();
    }

    register(){
        this.show();
        this.$sp_login_page.hide();
        this.$sp_register_page.show();
    }

    acapp_login(appid, redirect_uri, scope, state){
        let outer = this;
        outer.root.os.api.oauth2.authorize(appid, redirect_uri, scope, state, rep => {
            if(rep.result === 'success'){
                outer.username = rep.username;
                outer.photo = rep.photo;
                outer.back_img = rep.back_img;
                localStorage.setItem(`superperson-access`, rep.access);
                localStorage.setItem(`superperson-refresh`, rep.refresh);
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
                'Authorization': 'Bearer ' + localStorage.getItem(`superperson-access`),
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
                'Authorization': 'Bearer ' + localStorage.getItem(`superperson-access`),
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
