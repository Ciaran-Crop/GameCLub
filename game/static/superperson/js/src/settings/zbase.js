class SPGameLogin{
    constructor(root, os){
        this.root = root;
        this.platform = "WEB";
        if(this.root.os){
            this.platform = "ACAPP";
        }
        this.$sp_login_page = $(`
<div>
    <div class="sp-login-page">
        
    </div>
</div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_login_page);
        this.photo = '';
        this.start();
    }
    start(){
        this.get_info();
    }

    login(){
        this.$sp_login_page.show();
    }

    register(){
    }

    get_info(){
        let outer = this;
        $.ajax({
            url : 'https://app3774.acapp.acwing.com.cn/superperson/settings/get_info',
            type : 'GET',
            data : {'platform': outer.platform},
            success : function(rep){
                if(rep.result === 'success'){
                    console.log("get_info success with", rep.platform);
                    outer.username = rep.username;
                    outer.photo = rep.photo;
                    outer.hide();
                    outer.root.menu.show();
                }else {
                    console.log(rep);
                    outer.login();
                }
            },
        });
    }

    hide(){}

    show(){}
}
