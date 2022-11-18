class GameClubIndexLogin {
    constructor(root){
        this.root = root;
        this.$login_box = $(`
<div class="gc-index-login-box-wrap">
<div class="gc-index-login-box-img">
    <img src="https://app3774.acapp.acwing.com.cn/static/gameclub/images/index/hakase.jpg">
</div>
<div class="gc-index-login-box">
    <div class="gc-index-login-box-title">
        登录 GameClub
    </div>
    <div class="gc-index-login-box-form">
        <div class="gc-index-login-box-email">
            <div class="gc-index-login-box-email-logo">
                <img src="${BASE_URL}/static/gameclub/images/index/email.svg">
            </div>
            <div class="gc-index-login-box-email-input">
                <input type='email' placeholder="邮箱">
            </div>
        </div>
        <div class="gc-index-login-box-password">
            <div class="gc-index-login-box-passwd-logo">
                <img src="${BASE_URL}/static/gameclub/images/index/passwd.svg">
            </div>
            <div class="gc-index-login-box-passwd-input">
                <input type='password' placeholder="密码">
            </div>
        </div>
        <div class="gc-index-login-box-message">
            用户名或密码错误
        </div>
        <div class="gc-index-login-box-login-button">
            <button>登录</button>
        </div>
    </div>
    <div class="gc-index-login-box-other">
        <div class="gc-index-login-box-other-register">
            注册
        </div>
        <div class="gc-index-login-box-other-line">
            |
        </div>
        <div class="gc-index-login-box-other-forget">
            忘记密码?
        </div>
    </div>
    <div class="gc-index-login-box-third">
        <div class="gc-index-login-box-third-logo">
            <img width="30" height="30" src="${BASE_URL}/static/gameclub/images/index/acapp.jpg">
        </div>
    </div>

</div>
</div>
`);
        this.$login_box.hide();
        this.root.$gc_index.append(this.$login_box);
        this.start();
    }
    start(){
        this.$email_box = this.$login_box.find('.gc-index-login-box-email');
        this.$email_input = this.$email_box.find('input');
        this.$password_box = this.$login_box.find('.gc-index-login-box-password');
        this.$password_input = this.$password_box.find('input');
        this.$login_button = this.$login_box.find('.gc-index-login-box-login-button > button');
        this.$register_div = this.$login_box.find('.gc-index-login-box-other-register');
        this.$forget_div = this.$login_box.find('.gc-index-login-box-other-forget');
        this.$acwing_div = this.$login_box.find('.gc-index-login-box-third-logo');
        this.$error_message = this.$login_box.find(".gc-index-login-box-message");

        this.add_listening_events();
        this.to_span();
    }

    add_listening_events(){
        this.$email_input.focus(() => {
            this.email_error_focus(false, true);
        }).blur(() => {
            this.clear_email_password();
        });
        this.$password_input.focus(() => {
            this.password_error_focus(false, true);
        }).blur(() => {
            this.clear_email_password();
        });
        this.$login_button.on('click', () => {
            this.login();
        });
        this.$register_div.on('click', () => {
            window.location.href = `${BASE_URL}/gameclub/register/register/`;
        });
        this.$forget_div.on('click', () => {
            console.log('click forget div');
        });
        this.$acwing_div.on('click', () => {
            console.log('click acwing_div');
        });
    }

    login(){
        const email = this.$email_input.val();
        const password = this.$password_input.val();
        if(email === ''){
            this.email_error_focus(true);
            this.$email_input.attr('placeholder', "邮箱为空");
            this.$email_input.addClass('gc-index-input-change');
            return ;
        }
        if(password === ''){
            this.password_error_focus(true);
            this.$password_input.attr('placeholder', "密码为空");
            this.$password_input.addClass('gc-index-input-change');
            return ;
        }
        $.ajax({
            url: `${BASE_URL}/gameclub/jwt/token/`,
            type: 'post',
            data: {
                'username': email,
                'password': password,
            },
            success: rep => {
                localStorage.setItem('gc-access', rep.access);
                localStorage.setItem('gc-refresh', rep.refresh);
                this.to_span();
            },
            error: () => {
                this.password_error_focus(true, false);
                this.email_error_focus(true, false);
                this.$password_input.addClass('gc-index-input-change');
                this.$email_input.addClass('gc-index-input-change');
                this.$error_message.show();
            }
        });
    }

    password_error_focus(error, clear){
        if(clear) this.clear_email_password();
        if(error){
            this.$password_box.addClass('gc-index-login-box-input-error');
        }else{
            this.$password_box.addClass('gc-index-login-box-input-focus');
        }
    }


    clear_email_password(){
        if(this.$email_box.hasClass('gc-index-login-box-input-error')){
            this.$email_box.removeClass('gc-index-login-box-input-error');
        }
        if(this.$email_box.hasClass('gc-index-login-box-input-focus')){
            this.$email_box.removeClass('gc-index-login-box-input-error');
        }
        if(this.$email_box.hasClass('gc-index-login-box-input-focus')){
            this.$email_box.removeClass('gc-index-login-box-input-focus');
        }
        if(this.$password_box.hasClass('gc-index-login-box-input-error')){
            this.$password_box.removeClass('gc-index-login-box-input-error');
        }
        if(this.$password_box.hasClass('gc-index-login-box-input-focus')){
            this.$password_box.removeClass('gc-index-login-box-input-focus');
        }
        if(this.$email_input.hasClass('gc-index-input-change')){
            this.$email_input.removeClass('gc-index-input-change');
        }
        if(this.$password_input.hasClass('gc-index-input-change')){
            this.$password_input.removeClass('gc-index-input-change');
        }
        this.$email_input.attr('placeholder', '邮箱');
        this.$password_input.attr('placeholder', '密码');
        this.$error_message.hide();
    }


    email_error_focus(error, clear){
        if(clear) this.clear_email_password();
        if(error){
            this.$email_box.addClass('gc-index-login-box-input-error');
        }else{
            this.$email_box.addClass('gc-index-login-box-input-focus');
        }
    }

    refresh_tokens(){
        console.log('start refresh tokens');
        setInterval(() => {
            console.log('refresh tokens');
            $.ajax({
                url: `${BASE_URL}/gameclub/jwt/token/refresh`,
                type: 'POST',
                data: {
                    'refresh': localStorage.getItem('gc-refresh'),
                },
                success: rep => {
                    localStorage.setItem('gc-access', rep.access);
                }
        })}, 5000);
    }

    to_span(){
        $.ajax({
            url : `${BASE_URL}/gameclub/home/check/`,
            type : 'post',
            headers : {
                'Authorization': "Bearer " + localStorage.getItem('gc-access'),
            },
            success : rep => {
                this.refresh_tokens();
                window.location.href = `${BASE_URL}/gameclub/home/span/`;
            },
            error : () => {
                this.$login_box.show();
            }
        });
    }


}
