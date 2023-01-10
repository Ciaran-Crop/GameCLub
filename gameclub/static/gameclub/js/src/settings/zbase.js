class GameClubSetting {
    constructor(root){
        this.root = root;
        this.$setting_page = $(`
<div class='gc-home-setting-page'>
    <div class='gc-home-setting-div'>
        <div class='gc-home-setting-top'>
            <div class='gc-home-setting-title'>
                设置
            </div>
            <div class='gc-home-setting-cancel'>
                <img src='/static/gameclub/images/settings/cancel.svg'>
            </div>
        </div>
        <div class='gc-home-setting-content'>
            <div class='gc-home-setting-name'>
                <span class='gc-home-setting-span'>昵称: </span>
                <input type='text' disabled='true'>
                <img src='/static/gameclub/images/settings/edit.svg'>
                <button class='gc-home-setting-confirm disabled-click' id='name'>确定</button>
                <button class='gc-home-setting-confirm disabled-click' id='name-cancel'>取消</button>
            </div>
            <div class='gc-home-setting-email'>
                <span class='gc-home-setting-span'>邮箱: </span>
                <div class='gc-home-setting-email-show'></div>
                <button class='gc-home-setting-confirm' id='email'>绑定邮箱</button>
                <button class='gc-home-setting-confirm' id='password'>更改密码</button>
            </div>
            <div class='gc-home-setting-photo'>
                <span class='gc-home-setting-span'>头像: </span>
                <img src=''>
                <input type='file' name='photo' accept='image/*' style='display: none'>
                <button class='gc-home-setting-confirm' id='photo'>上传头像</button>
            </div>
            <div class='gc-home-setting-back'>
                <span class='gc-home-setting-span'>背景: </span>
                <img src=''>
                <input type='file' name='back' accept='image/*' style='display: none'>
                <button class='gc-home-setting-confirm' id='back'>上传背景</button>
            </div>
        </div>
    </div>
</div>
`);
        this.$error_message = $(`
<div class='gc-home-error-message'>
</div>
`);
        this.$success_message = $(`
<div class='gc-home-success-message'>
</div>
`);
        this.$setting_page.append(this.$error_message);
        this.$setting_page.append(this.$success_message);
        this.$setting_page.hide();
        this.root.$root_div.append(this.$setting_page);
        this.$span_cancel = this.$setting_page.find('.gc-home-setting-cancel');
        this.$span_name_input = this.$setting_page.find('.gc-home-setting-name > input');
        this.$span_name_edit = this.$setting_page.find('.gc-home-setting-name > img');
        this.$span_name_confirm = this.$setting_page.find('#name');
        this.$span_name_cancel = this.$setting_page.find('#name-cancel');
        this.$span_email_show = this.$setting_page.find('.gc-home-setting-email-show');
        this.$span_email_change = this.$setting_page.find('#email');
        this.$span_password_change = this.$setting_page.find('#password');
        this.$span_photo_img = this.$setting_page.find('.gc-home-setting-photo > img');
        this.$span_photo_input = this.$setting_page.find('.gc-home-setting-photo > input');
        this.$span_photo_change = this.$setting_page.find('#photo');
        this.$span_back_img = this.$setting_page.find('.gc-home-setting-back > img');
        this.$span_back_input = this.$setting_page.find('.gc-home-setting-back > input');
        this.$span_back_change = this.$setting_page.find('#back');


        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        this.$span_cancel.on('click', () => {
            this.hide();
        });
        this.$span_name_edit.on('click', () => {
            this.$span_name_edit.fadeOut();
            this.$span_name_confirm.removeClass('disabled-click');
            this.$span_name_cancel.removeClass('disabled-click');
            this.$span_name_input.attr('disabled', false);
        });
        this.$span_name_confirm.on('click', (e) => {
            this.change_name(this.$span_name_input.val(), e);
        });
        this.$span_name_cancel.on('click', () => {
            this.$span_name_input.attr('disabled', true);
            this.$span_name_confirm.addClass('disabled-click');
            this.$span_name_cancel.addClass('disabled-click');
            this.$span_name_edit.fadeIn();
            this.$span_name_input.val(this.root.name);
        });
        this.$span_password_change.on('click', () => {
            if(this.$span_password_change.hasClass("disabled-click")){
                return false;
            }
            window.location.href = `${BASE_URL}/gameclub/page/forget/?email=` + this.root.email;
        });
        this.$span_email_change.on('click', () => {
            if(this.$span_email_change.hasClass("disabled-click")){
                return false;
            }
            window.location.href = `${BASE_URL}/gameclub/page/bind/`;
        });
        this.$span_photo_input.change(() => {
            let x = this.$span_photo_change.offset().left;
            let y = this.$span_photo_change.offset().top;
            this.change_file('photo', x, y);
        });
        this.$span_back_input.change(() => {
            let x = this.$span_back_change.offset().left;
            let y = this.$span_back_change.offset().top;
            this.change_file('back', x, y);
        });
        this.$span_photo_change.on('click', () => {
            this.$span_photo_input.click();
        });
        this.$span_back_change.on('click', () => {
            this.$span_back_input.click();
        });
    }

    get_error_message(val, x, y){
        this.$error_message.css('top', y + 'px');
        this.$error_message.css('left', x + 'px');
        this.$error_message.text(val);
        this.$error_message.show();
        this.$error_message.animate({top: (y - 50) + 'px'}, 'normal', 'linear');
        this.$error_message.fadeOut();
    }

    get_success_message(val, x, y){
        this.$success_message.css('top', y + 'px');
        this.$success_message.css('left', x + 'px');
        this.$success_message.text(val);
        this.$success_message.show();
        this.$success_message.animate({top: (y - 50) + 'px'}, 'normal', 'linear');
        this.$success_message.fadeOut();
    }

    change_file(type, x, y){
        let file = null;
        if(type === 'photo'){
            const files = document.getElementsByName('photo')[0].files;
            file = files[0];
        }else if(type === 'back'){
            const files = document.getElementsByName('back')[0].files;
            file = files[0];
        }

        let formdata = new FormData();
        formdata.append('type', type);
        formdata.append('file', file);
        $.ajax({
            url: `${BASE_URL}/gameclub/auth/change/`,
            type: 'post',
            dataType: 'json',
            processData: false,
            contentType: false,
            data: formdata,
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('gc-access'),
            },
            success: rep => {
                if(rep.result === 'success'){
                    this.get_success_message('上传成功, 请刷新页面', x, y);
                }else{
                    this.get_error_message(rep.result, x, y);
                }
                this.$span_photo_input.value = '';
                this.$span_back_input.value = '';

            },
            error : () => {
                this.get_error_message('上传失败, 请再次尝试', x, y);
                this.$span_photo_input.value = '';
                this.$span_back_input.value = '';
            }
        });

    }

    change_name(name, e){
        let x = e.clientX;
        let y = e.clientY;
        $.ajax({
            url: `${BASE_URL}/gameclub/auth/change/`,
            type: 'post',
            data: {
                'type': 'name',
                'name': name,
            },
            headers: {
                'Authorization' : 'Bearer ' + localStorage.getItem('gc-access'),
            },
            success: rep => {
                this.$span_name_input.attr('disabled', true);
                this.$span_name_confirm.addClass('disabled-click');
                this.$span_name_cancel.addClass('disabled-click');
                this.$span_name_edit.fadeIn();
                this.get_success_message('修改成功', x, y);
            },
            error : () => {
                this.get_error_message('修改失败, 请再次尝试', x, y);
            }
        });
    }

    padding_info(){
        this.$span_name_input.val(this.root.name);
        if(this.root.email.search('@gameclub.net') === -1){
            this.$span_email_show.text(this.root.email);
            this.$span_email_change.addClass('disabled-click');
        }else{
            this.$span_email_show.text('第三方登录, 无邮箱');
            this.$span_password_change.addClass('disabled-click');
        }
        this.$span_photo_img.attr('src', this.root.photo);
        this.$span_back_img.attr('src', this.root.back);
    }


    show(){
        this.$setting_page.fadeIn();
    }

    hide(){
        this.$setting_page.fadeOut();
    }

}
