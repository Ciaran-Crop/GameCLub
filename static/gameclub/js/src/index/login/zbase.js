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
                <input type='text' placeholder="邮箱">
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
        <div class="gc-index-login-box-login-button">
            <button>登录</button>
        </div>
    </div>
    <br>
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
    <br>
    <div class="gc-index-login-box-third">
        <div class="gc-index-login-box-third-logo">
            <img width="30" height="30" src="${BASE_URL}/static/gameclub/images/index/acapp.jpg">
        </div>
        <div class="gc-index-login-box-third-name">
            ACWing 登录
        </div>
    </div>

</div>
</div>
`);
        this.root.$gc_index.append(this.$login_box);
        this.start();
    }
    start(){}

    add_listening_events(){
    }
}
