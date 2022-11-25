export class GameClubBind {
    constructor(id, os, email){
        this.id = id;
        this.os = os;
        this.email = email;
        this.$root_div = $('#' + id);
        this.$gc_forget = $(`
<div class="gc-index-back"></div>
<div class="gc-index-forget-box-wrap">
    <section class="gc-index-forget-box-email-section">
       <div class="gc-index-forget-box-title">
            输入账号
       </div>
       <div class="gc-index-forget-box-sub-title">
            请输入要重置密码的邮箱账号
       </div>
       <div class="gc-index-forget-box-email">
            <input type="email" placeholder = "请输入邮箱">
       </div>
       <div class="gc-index-forget-box-next-validate">
            <button>下一步</button>
       </div>
    </section>
    <section class="gc-index-forget-box-validate-section">
        <div class="gc-index-forget-box-title">
            验证邮箱
       </div>
       <div class="gc-index-forget-box-sub-title">
       </div>
       <div class="gc-index-forget-box-validate">
            <input type="text" placeholder = "请输入验证码">
            <div class="gc-index-forget-box-send">
            <button class="gc-index-forget-box-send-button">
                <span>发送验证码</span>
            </button>
            </div>
       </div>
       <div class="gc-index-forget-box-message">
       </div>
       <div class="gc-index-forget-box-next-change">
            <button>完成</button>
       </div>
    </section>
</div>
`);
        this.$gc_forget_email = this.$gc_forget.find('.gc-index-forget-box-email-section');
        this.$gc_forget_validate = this.$gc_forget.find('.gc-index-forget-box-validate-section');
        this.$gc_forget_validate.hide();
        this.$root_div.append(this.$gc_forget);
        this.start();
    }
    start(){
        this.$email_input = this.$gc_forget_email.find('.gc-index-forget-box-email > input');
        this.$next_to_validate = this.$gc_forget_email.find('.gc-index-forget-box-next-validate > button');
        this.$validate_input = this.$gc_forget_validate.find('.gc-index-forget-box-validate > input');
        this.$next_to_change = this.$gc_forget_validate.find('.gc-index-forget-box-next-change > button');
        this.$send_email = this.$gc_forget_validate.find('.gc-index-forget-box-send-button');
        this.$error_message2 = this.$gc_forget_validate.find('.gc-index-forget-box-message');
        if(this.email){
            let email_input = this.$gc_forget_email.find('.gc-index-forget-box-email > input');
            email_input.val(this.email);
        }
        this.add_listening_events();
    }
    add_listening_events(){
        this.$gc_forget_email.keydown((e) => {
            if(e.which === 13){
                this.$next_to_validate.click();
            }
        });
        this.$gc_forget_validate.keydown((e) => {
            if(e.which === 13){
                this.$next_to_change.click();
            }
        });

        this.$next_to_validate.on('click', () => {
            if(this.check_email()){
                this.$gc_forget_email.hide();
                this.$gc_forget_validate.show();
                let sub_title = this.$gc_forget_validate.find(".gc-index-forget-box-sub-title");
                sub_title.text('点击获取验证码，验证码将发送至邮箱' + this.email);
            }else{
                this.$email_input.css('border', '1px solid red');
                setTimeout(() => {
                    this.$email_input.css('border', '1px solid #dcdee2');
                }, 500);
            }
        });
        this.$next_to_change.on('click', () => {
            if(this.check_confirm()){
                this.change_email(this.$validate_input.val());
            }else{
                this.$validate_input.css('border', '1px solid red');
                setTimeout(() => {
                    this.$validate_input.css('border', '1px solid #dcdee2');
                }, 500);
            }
        });
        this.$send_email.on('click', () => {
            this.send_email(this.email);
        });
    }

    send_email(email){
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
                    this.show_error_message(rep.result);
                }
            },
        });

    }
    change_send_button(){
        this.$span_text = this.$send_email.find('span');
        let i = 60;
        this.$send_email.attr('disabled', true);
        this.$span_text.text('重新发送(' + i + 's)');
        let func_id = setInterval(() => {
            i -= 1;
            this.$span_text.text('重新发送(' + i + 's)');
        }, 1000);
        setTimeout(() => {
            clearInterval(func_id);
            this.$send_email.attr('disabled', false);
            this.$span_text.text('发送验证码');
        }, 60000);

    }

    change_email(validate){
        $.ajax({
            url: `${BASE_URL}/gameclub/auth/change/`,
            type: 'post',
            data: {
                'type': 'email',
                'email': this.email,
                'validate': validate,
            },
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('gc-access'),
            },
            success: rep => {
                if(rep.result === 'success'){
                    window.location.href = `${BASE_URL}/`;
                }else{
                    this.show_error_message(rep.result);
                }
            }
        });

    }

    check_confirm(){
        const confirm_ = this.$validate_input.val();
        if(confirm_ === '') return false;
        return true;
    }

    show_error_message(text){
        this.$error_message2.text(text);
        this.$error_message2.show();
        setTimeout(() => {
            this.$error_message2.hide();
        }, 1000);
    }

    check_email(){
        const email = this.$email_input.val();
        if(email.search('@') === -1){
            return false;
        }
        if(email === ''){
            return false;
        }else{
            this.email = email;
            return true;
        }
    }
}

