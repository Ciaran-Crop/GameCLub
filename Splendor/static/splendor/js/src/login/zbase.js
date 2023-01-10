export class SplendorLogin {
    constructor(id, os, access, refresh){
        this.id = id;
        this.os = os;
        this.$splendor_div = $('#' + id);
        if(!localStorage.getItem(`gc-access`)){
            localStorage.setItem(`gc-access`, access);
        }
        if(!localStorage.getItem(`gc-refresh`)){
            localStorage.setItem(`gc-refresh`, refresh);
        }
        refresh_();
        this.start();
    }
    start(){
        this.$login_div = $(`
<div class='splendor-login-wrap'>
    <div class='splendor-login-box'>
        <div class='splendor-login-logo'>
        </div>
        <div class='splendor-login-content'>
            <div class='splendor-login-title'>
                <span>您还未登录,请前往GameClub登录</span>
            </div>
            <div class='splendor-login-button'>
                <a>前往GameClub登录</a>
            </div>
        </div>
    </div>
</div>
`);
        this.$login_div.hide();
        this.$splendor_div.append(this.$login_div);
        this.add_listening_events();
        this.get_info();
    }

    add_listening_events(){
        this.$login_div.find('.splendor-login-button').on('click', () => {
            window.location.href=`${BASE_URL}/?redirect=https://app3774.acapp.acwing.com.cn/splendor/`;
        });
    }

    login(){
        this.$login_div.show();
    }

    get_info(){
        $.ajax({
            url: `${BASE_URL}/gameclub/auth/check/`,
            type: 'post',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('gc-access'),
            },
            success : rep => {
                window.location.href = `${BASE_URL}/splendor/page/menu/`;
            },
            error : rep => {
                this.login();
            }
        });
    }
}
