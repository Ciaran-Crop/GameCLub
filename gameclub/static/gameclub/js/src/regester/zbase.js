export class GameClubRegister {
    constructor(id, os){
        this.id = id;
        this.os = os;
        this.$root_div = $('#' + id);
        this.$gc_register = $(`
<div class="gc-index-back"></div>
<div class="gc-index-register-wrap">
    <div class="gc-index-register-box">
        <div class="gc-index-register-title">欢迎注册 GameClub</div>
        <div class="gc-index-register-box-form">
            <div class="gc-index-register-box-name">
                <div class="gc-index-register-box-name-logo">
                    <img src="${BASE_URL}/static/gameclub/images/register/name.svg">
                </div>
                <div class="gc-index-register-box-name-input">
                    <input type='text' placeholder="昵称">
                </div>
            </div>
            <div class="gc-index-register-box-email">
                <div class="gc-index-register-box-email-logo">
                    <img src="${BASE_URL}/static/gameclub/images/index/email.svg">
                </div>
                <div class="gc-index-register-box-email-input">
                    <input type='email' placeholder="邮箱">
                </div>
            </div>

            <div class="gc-index-register-box-password">
                <div class="gc-index-register-box-password-logo">
                    <img src="${BASE_URL}/static/gameclub/images/index/passwd.svg">
                </div>
                <div class="gc-index-register-box-password-input">
                    <input type='password' placeholder="密码">
                </div>
            </div>

            <div class="gc-index-register-box-password-confirm">
                <div class="gc-index-register-box-password-confirm-logo">
                    <img src="${BASE_URL}/static/gameclub/images/index/passwd.svg">
                </div>
                <div class="gc-index-register-box-password-confirm-input">
                    <input type='password' placeholder="再次输入密码">
                </div>
            </div>

            <div class="gc-index-register-box-confirm-email">
                <div class="gc-index-register-box-confirm-email-logo">
                    <img src="${BASE_URL}/static/gameclub/images/register/confirm.svg">
                </div>
                <div class="gc-index-register-box-confirm-email-input">
                    <input type='text' placeholder="输入验证码">
                </div>
                <div class="gc-index-register-box-confirm-email-send">
                    <button>发送验证码</button>
                </div>
            </div>
            <div class="gc-index-register-box-message"></div>
            <div class="gc-index-register-box-register-button">
                <button>立即注册</button>
            </div>
        </div>
        <div class="gc-index-register-box-other">
            <div class="gc-index-register-box-other-login">
                登录
            </div>
            <div class="gc-index-register-box-other-line">
                |
            </div>
            <div class="gc-index-register-box-other-forget">
                忘记密码?
            </div>
        </div>
    </div>
</div>
`);
        this.$root_div.append(this.$gc_register);
        this.start();
    }

    start(){
        this.$name_box = this.$gc_register.find('.gc-index-register-box-name');
        this.$name_input = this.$gc_register.find('.gc-index-register-box-name-input > input');
        this.$email_box = this.$gc_register.find('.gc-index-register-box-email');
        this.$email_input = this.$gc_register.find('.gc-index-register-box-email-input > input');
        this.$password_box = this.$gc_register.find('.gc-index-register-box-password');
        this.$password_input = this.$gc_register.find('.gc-index-register-box-password-input > input');
        this.$password_confirm_box = this.$gc_register.find('.gc-index-register-box-password-confirm');
        this.$password_confirm_input = this.$gc_register.find('.gc-index-register-box-password-confirm-input > input');
        this.$confirm_email_box = this.$gc_register.find('.gc-index-register-box-confirm-email');
        this.$confirm_email_input = this.$gc_register.find('.gc-index-register-box-confirm-email-input > input');
        this.$confirm_email_send = this.$gc_register.find('.gc-index-register-box-confirm-email-send > button');
        this.$register_button = this.$gc_register.find('.gc-index-register-box-register-button');
        this.$other_login = this.$gc_register.find('.gc-index-register-box-other-login');
        this.$other_forget = this.$gc_register.find('.gc-index-register-box-other-forget');
        this.$error_message = this.$gc_register.find('.gc-index-register-box-message');
        this.$register_box = this.$gc_register.find('.gc-index-register-box');
        this.add_listening_events();
    }

    add_listening_events(){
        this.$name_input.focus(() => {
            this.name_error_focus(false, true);
        }).blur(() => {
            this.clear_email_password();
        });
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
        this.$password_confirm_input.focus(() => {
            this.password_confirm_error_focus(false, true);
        }).blur(() => {
            this.clear_email_password();
        });
        this.$confirm_email_input.focus(() => {
            this.confirm_email_error_focus(false, true);
        }).blur(() => {
            this.clear_email_password();
        });
        this.$register_button.on('click', () => {
            this.register();
        });
        this.$other_login.on('click', () => {
            window.location.href = `${BASE_URL}/`;
        });
        this.$other_forget.on('click', () => {
            window.location.href = `${BASE_URL}/gameclub/page/forget/`;
        });
        this.$confirm_email_send.on('click', () => {
            this.send();
        });
        this.$register_box.keydown((e) => {
            if(e.which === 13){
                this.$register_button.click();
            }
        });
    }

    register(){
        const name = this.$name_input.val();
        const email = this.$email_input.val();
        const password = this.$password_input.val();
        const password_confirm = this.$password_confirm_input.val();
        const confirm_email = this.$confirm_email_input.val();
        if(name === ''){
            this.name_error_focus(true, true);
            this.$name_input.attr('placeholder', '请填入昵称');
            this.$name_input.addClass('gc-index-input-change');
            return ;
        }
        if(email === ''){
            this.email_error_focus(true, true);
            this.$email_input.attr('placeholder', '请填入邮箱');
            this.$email_input.addClass('gc-index-input-change');
            return ;
        }
        if(email.search('@') === -1){
            this.email_error_focus(true, true);
            this.$error_message.text("邮箱格式错误");
            this.$error_message.show();
            return ;
        }
        if(password === ''){
            this.password_error_focus(true, true);
            this.$password_input.attr('placeholder', '请填入密码');
            this.$email_input.addClass('gc-index-input-change');
            return ;
        }
        if(password_confirm === ''){
            this.password_confirm_error_focus(true, true);
            this.$password_confirm_input.attr('placeholder', '请再次填入密码');
            this.$password_confirm_input.addClass('gc-index-input-change');
            return ;
        }
        if(confirm_email === ''){
            this.confirm_email_error_focus(true, true);
            this.$confirm_email_input.attr('placeholder', '请填入验证码');
            this.$confirm_email_input.addClass('gc-index-input-change');
            return ;
        }
        if(password !== password_confirm){
            this.password_error_focus(true, true);
            this.password_confirm_error_focus(true, false);
            this.$error_message.text("密码不一致");
            this.$error_message.show();
            return ;
        }

        $.ajax({
            url : `${BASE_URL}/gameclub/auth/signup/`,
            type: 'post',
            data: {
                'name': name,
                'email': email,
                'password': password,
                'confirm': confirm_email,
            },
            success : rep => {
                if(rep.result === 'success'){
                    window.location.href = rep.url;
                }else{
                    this.$error_message.val(rep.result);
                    this.$error_message.show();
                }
            }
        })
    }

    send(){
        const email = this.$email_input.val();
        if(email === ''){
            this.email_error_focus(true, true);
            this.$email_input.attr('placeholder', '请填入邮箱');
            this.$email_input.addClass('gc-index-input-change');
            return ;
        }
        if(email.search('@') === -1){
            this.email_error_focus(true, true);
            this.$error_message.text("邮箱格式错误");
            this.$error_message.show();
            return ;
        }

        $.ajax({
            url: `${BASE_URL}/gameclub/auth/send_email/`,
            type: 'post',
            data: {
                'email': email,
                'change': 'false',
            },
            success : rep => {
                if(rep.result === 'success'){
                    this.change_send_button();
                }else{
                    this.email_error_focus(true, true);
                    this.$error_message.val(rep.result);
                    this.$error_message.show();
                }
            },
        });

    }

    change_send_button(){
        this.clear_email_password();
        this.$confirm_email_send.attr('disabled',true);
        let i = 60;
        this.$confirm_email_send.text('重新发送(' + i + 's)');
        this.$confirm_email_send.css('cursor','not-allowed');
        let func_id = setInterval(() => {
            i -= 1;
            this.$confirm_email_send.text('重新发送(' + i + 's)');
            this.$confirm_email_send.css('cursor','not-allowed');
        }, 1000);
        setTimeout(() => {
            clearInterval(func_id);
            this.$confirm_email_send.attr('disabled', false);
            this.$confirm_email_send.text('发送验证码');
            this.$confirm_email_send.css('cursor','pointer');
        }, 60000);
    }

    confirm_email_error_focus(error, clear){
        if(clear) this.clear_email_password();
        if(error){
            this.$confirm_email_box.addClass('gc-index-login-box-input-error');
        }else{
            this.$confirm_email_box.addClass('gc-index-login-box-input-focus');
        }
    }
    name_error_focus(error, clear){
        if(clear) this.clear_email_password();
        if(error){
            this.$name_box.addClass('gc-index-login-box-input-error');
        }else{
            this.$name_box.addClass('gc-index-login-box-input-focus');
        }
    }

    password_confirm_error_focus(error, clear){
        if(clear) this.clear_email_password();
        if(error){
            this.$password_confirm_box.addClass('gc-index-login-box-input-error');
        }else{
            this.$password_confirm_box.addClass('gc-index-login-box-input-focus');
        }
    }

    password_error_focus(error, clear){
        if(clear) this.clear_email_password();
        if(error){
            this.$password_box.addClass('gc-index-login-box-input-error');
        }else{
            this.$password_box.addClass('gc-index-login-box-input-focus');
        }
    }

    email_error_focus(error, clear){
        if(clear) this.clear_email_password();
        if(error){
            this.$email_box.addClass('gc-index-login-box-input-error');
        }else{
            this.$email_box.addClass('gc-index-login-box-input-focus');
        }
    }


    clear_email_password(){
        if(this.$name_box.hasClass('gc-index-login-box-input-error')){
            this.$name_box.removeClass('gc-index-login-box-input-error');
        }
        if(this.$name_box.hasClass('gc-index-login-box-input-focus')){
            this.$name_box.removeClass('gc-index-login-box-input-focus');
        }
        if(this.$email_box.hasClass('gc-index-login-box-input-error')){
            this.$email_box.removeClass('gc-index-login-box-input-error');
        }
        if(this.$email_box.hasClass('gc-index-login-box-input-focus')){
            this.$email_box.removeClass('gc-index-login-box-input-focus');
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
        if(this.$password_confirm_box.hasClass('gc-index-login-box-input-focus')){
            this.$password_confirm_box.removeClass('gc-index-login-box-input-focus');
        }
        if(this.$password_confirm_box.hasClass('gc-index-login-box-input-error')){
            this.$password_confirm_box.removeClass('gc-index-login-box-input-error');
        }
        if(this.$confirm_email_box.hasClass('gc-index-login-box-input-focus')){
            this.$confirm_email_box.removeClass('gc-index-login-box-input-focus');
        }
        if(this.$confirm_email_box.hasClass('gc-index-login-box-input-error')){
            this.$confirm_email_box.removeClass('gc-index-login-box-input-error');
        }
        if(this.$email_input.hasClass('gc-index-input-change')){
            this.$email_input.removeClass('gc-index-input-change');
        }
        if(this.$password_input.hasClass('gc-index-input-change')){
            this.$password_input.removeClass('gc-index-input-change');
        }
        if(this.$password_confirm_input.hasClass('gc-index-input-change')){
            this.$password_confirm_input.removeClass('gc-index-input-change');
        }
        if(this.$confirm_email_input.hasClass('gc-index-input-change')){
            this.$confirm_email_input.removeClass('gc-index-input-change');
        }
        if(this.$name_input.hasClass('gc-index-input-change')){
            this.$name_input.removeClass('gc-index-input-change');
        }
        this.$email_input.attr('placeholder', '邮箱');
        this.$password_input.attr('placeholder', '密码');
        this.$password_confirm_box.attr('placeholder', '再次输入密码');
        this.$confirm_email_input.attr('placeholder', '输入验证码');
        this.$name_input.attr('placeholder', "昵称");
        this.$error_message.hide();
    }
}
