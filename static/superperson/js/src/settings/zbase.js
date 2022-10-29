class SPGameLogin{
    constructor(root, os){
        this.root = root;
        this.platform = "WEB";
        if(this.root.os){
            this.platform = "AC";
        }
        this.start();
    }
    start(){
        this.get_info();
    }

    login(){
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
                    console.log("get_info success");
                    outer.hide();
                    outer.root.menu.show();
                }else {
                    outer.login();
                }
            },
        });
    }

    hide(){}

    show(){}
}
