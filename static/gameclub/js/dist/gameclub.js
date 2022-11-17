const BASE_URL="https://app3774.acapp.acwing.com.cn";class GameClubIndexBack{constructor(i){this.root=i,this.$back=$('<div class="gc-index-back"></div>'),this.root.$gc_index.append(this.$back),this.start()}start(){}}class GameClubIndexLogin{constructor(i){this.root=i,this.$login_box=$(`\n<div class="gc-index-login-box-wrap">\n<div class="gc-index-login-box-img">\n    <img src="https://app3774.acapp.acwing.com.cn/static/gameclub/images/index/hakase.jpg">\n</div>\n<div class="gc-index-login-box">\n    <div class="gc-index-login-box-title">\n        登录 GameClub\n    </div>\n    <div class="gc-index-login-box-form">\n        <div class="gc-index-login-box-email">\n            <div class="gc-index-login-box-email-logo">\n                <img src="${BASE_URL}/static/gameclub/images/index/email.svg">\n            </div>\n            <div class="gc-index-login-box-email-input">\n                <input type='text' placeholder="邮箱">\n            </div>\n        </div>\n        <div class="gc-index-login-box-password">\n            <div class="gc-index-login-box-passwd-logo">\n                <img src="${BASE_URL}/static/gameclub/images/index/passwd.svg">\n            </div>\n            <div class="gc-index-login-box-passwd-input">\n                <input type='password' placeholder="密码">\n            </div>\n        </div>\n        <div class="gc-index-login-box-login-button">\n            <button>登录</button>\n        </div>\n    </div>\n    <br>\n    <div class="gc-index-login-box-other">\n        <div class="gc-index-login-box-other-register">\n            注册\n        </div>\n        <div class="gc-index-login-box-other-line">\n            |\n        </div>\n        <div class="gc-index-login-box-other-forget">\n            忘记密码?\n        </div>\n    </div>\n    <br>\n    <div class="gc-index-login-box-third">\n        <div class="gc-index-login-box-third-logo">\n            <img width="30" height="30" src="${BASE_URL}/static/gameclub/images/index/acapp.jpg">\n        </div>\n        <div class="gc-index-login-box-third-name">\n            ACWing 登录\n        </div>\n    </div>\n\n</div>\n</div>\n`),this.root.$gc_index.append(this.$login_box),this.start()}start(){}add_listening_events(){}}export class GameClubIndex{constructor(i,n,s,t){this.id=i,this.os=n,localStorage.getItem("gc-access")&&localStorage.setItem("gc-access",s),localStorage.getItem("gc-refresh")&&localStorage.setItem("gc-refresh",t),this.$gc_index=$("\n<div class='gc-index'>\n</div>\n"),this.$root_div=$("#"+i),this.$root_div.append(this.$gc_index),this.start()}start(){this.back=new GameClubIndexBack(this),this.login_box=new GameClubIndexLogin(this)}}