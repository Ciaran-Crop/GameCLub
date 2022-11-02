class SPGameMenu {
    constructor(root) {
        this.root = root;
        this.$sp_game_menu = $(`
<div class="sp-game-menu">
    <div class="sp-game-menu-field">
        <div class="sp-game-menu-item sp-game-menu-item-single-mode">单人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-multi-mode">多人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-settings">退出</div>
    </div>
</div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_menu);

        this.$single_mode = this.$sp_game_menu.find('.sp-game-menu-item-single-mode');
        this.$multi_mode = this.$sp_game_menu.find('.sp-game-menu-item-multi-mode');
        this.$settings = this.$sp_game_menu.find('.sp-game-menu-item-settings')
        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer = this;
        this.$single_mode.click(function(){
            console.log("click single mode");
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            if(outer.root.login.platform === 'ACAPP'){
                console.log("ACAPP logout");
            }else{
                $.ajax({
                    url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/user_logout/',
                    type: 'GET',
                    success: function(rep){
                        if(rep.result === 'success'){
                            location.reload();
                        }
                    }
                });
            }
        });
    }
    show(){
        this.back_img = this.root.login.back_img;
        this.$sp_game_menu.css("background-image","url(" + this.back_img + ")");
        this.$sp_game_menu.show();
    }

    hide(){
        this.$sp_game_menu.hide();
    }
}
let SP_GAME_OBJECTS = []

class SPGameObject {
    constructor(){
        SP_GAME_OBJECTS.push(this);

        this.is_called_start = false;
        this.timedelta = 0;


    }

    start() { // 第一帧执行

    }

    update(){ // 后续每一帧执行一次

    }

    on_destroy(){ // 删除之前的操作

    }

    destroy(){ // 删除对象
        this.on_destroy();
        for(let i = 0;i < SP_GAME_OBJECTS.length; i++){

            if(SP_GAME_OBJECTS[i] === this){
                SP_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let SP_GAME_ANIMATION = function(timestamp){
    for(let i = 0;i < SP_GAME_OBJECTS.length;i ++){
        let obj = SP_GAME_OBJECTS[i];
        if(obj.is_called_start === false){
            obj.start();
            obj.is_called_start = true;
        }else {
            obj.update();
            obj.timedelta = timestamp - last_timestamp;
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(SP_GAME_ANIMATION);
}


requestAnimationFrame(SP_GAME_ANIMATION);
class SPGameMap extends SPGameObject{
    constructor(playground) {
        super();
        this.playground = playground;
        // 画布标签
        this.$canvas = $(`<canvas class="sp-game-map-canvas"></canvas>`);
        // 获取2D画布内容对象
        this.ctx = this.$canvas[0].getContext('2d');
        // 设置长宽
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$sp_game_playground.append(this.$canvas);
        this.back_img = new Image();
        this.back_img.src = this.playground.root.login.back_img;
}
    start(){
        this.render();
    }
    update(){
        this.render();
    }
    render(){
        this.ctx.drawImage(this.back_img, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        // this.ctx.fillRect(0,0,this.playground.width,this.playground.height);
    }
}
class SPGameParticle extends SPGameObject {
    constructor(playground, angle, x, y, color, speed, radius, move_length){

        super();
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        this.color = color;
        this.speed = speed;
        this.friction = 0.9;
        this.eps = 1;
        this.radius = radius;
        this.move_length = move_length;
    }

    start(){

    }

    update(){
        if(this.speed > this.eps && this.move_length > this.eps){
            let moved = Math.min(this.move_length, this.timedelta * this.speed / 1000);

            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.speed *= this.friction;
            this.move_length -= moved;
        }else {
            this.destroy();
            return false;
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x,this.y,this.radius,0, Math.PI * 2,false);
        this.ctx.fill();
    }
}
class SPGamePlayer extends SPGameObject {
    constructor(playground,x,y,color,speed,radius,is_me, is_robot) {
        super();
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = this.vy = 0;
        this.move_length = 0;
        this.eps = 0.1;
        this.color = color;
        this.speed = speed;
        this.other_speed = 0;
        this.radius = radius;
        this.is_me = is_me;
        this.friction = 0.9;
        this.cur_skill = null;
        this.is_robot = is_robot;
        if(this.is_me && this.playground.root.login.photo !== ' '){
            this.img = new Image();
            this.img.src = this.playground.root.login.photo;
            console.log(this.playground.root.login.photo);
        }
    }

    start(){
        if(this.is_me) {
            this.add_listening_events();
        }else{
            if(this.is_robot){
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx, ty);
            }
        }
    }

    add_listening_events(){
        let outer = this;
        this.playground.sp_game_map.$canvas.on("contextmenu", function(){
            return false;
        });

        this.playground.sp_game_map.$canvas.mousedown(function(e){
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which === 3){
                outer.move_to(e.clientX - rect.left,e.clientY - rect.top);
            }else if(e.which === 1) {
                outer.unleash_skills(e.clientX - rect.left, e.clientY - rect.top, outer.cur_skill);

            }
        });

        $(window).keydown(function(e){
            if(e.which === 81){ // q
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }


    unleash_skills(tx,ty, skill_name){
        if(skill_name === "fireball"){
            this.shoot_fireball(tx,ty);
        }else if(skill_name === null){
            return false;
        }
        this.cur_skill = null;
    }


    shoot_fireball(tx, ty){
        let angle = Math.atan2(ty - this.y, tx - this.x);
        new SPGameSkillFireBall(this.playground, this, this.x, this.y, angle);
    }

    get_dist(x1,y1,x2,y2){
        let dx = (x2 - x1) * (x2 - x1);
        let dy = (y2 - y1) * (y2 - y1);
        return Math.sqrt(dx + dy);
    }

    move_to(tx, ty){
        this.move_length = this.get_dist(tx,ty,this.x,this.y);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    attacked(angle, damage){
        this.radius -= damage;
        this.move_length = 0;
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        this.other_speed = this.speed * 2;
        for(let i = 0;i < 10 + Math.random() * 5;i++){
            let speed = this.speed * 10 + Math.random() * this.speed;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.random() * Math.PI * 2;
            let move_length = this.radius * Math.random() * 10;
            new SPGameParticle(this.playground,angle,this.x, this.y, this.color, speed, radius, move_length);
        }
        if(this.radius < 10){
            this.destroy();
        }
    }

    player_collide(player){
        if(this.vs === 0) this.vx = player.vx;
        else this.vx = -this.vx;
        if(this.vy === 0) this.vy = player.vy;
        else this.vy = -this.vy;
        this.move_length = 0;
        this.other_speed = this.speed * 2;
    }

    update(){
        for(let i = 0;i < this.playground.players.length;i++){
            let player = this.playground.players[i];
            let distance = this.get_dist(this.x,this.y, player.x, player.y);
            if(player !== this && distance <= this.radius + player.radius){
                this.player_collide(player);
            }
        }
        if(this.other_speed > this.eps && this.move_length < this.eps){
            this.x += this.vx * this.other_speed * this.timedelta / 1000;
            this.y += this.vy * this.other_speed * this.timedelta / 1000;
            this.other_speed *= this.friction;
        }else{
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        if(this.is_me){

        }else{
            if(this.is_robot){
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                if(this.move_length < 5){
                    this.move_to(tx, ty);
                }
                if(this.cur_skill === null && Math.random() < 1 / (20.0 * this.playground.players.length)){
                    let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                    this.unleash_skills(player.x,player.y, "fireball");

                }
            }
        }
        this.render();
    }

    render(){
        if(this.is_me && this.playground.root.login.photo !== ' '){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
            this.ctx.strokeStyle = "white";
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius* 2);
            this.ctx.restore();
        }else{
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    on_destroy(){
        if(this.is_me){
            $(window).unbind()
        }
    }
    destroy(){
        super.destroy();
        for(let i = 0;i < this.playground.players.length;i++){
            if(this.playground.players[i] === this){
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
}
class SPGameSkillFireBall extends SPGameObject {
    constructor(playground, player, x, y, angle) {
        super();
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        this.radius = this.playground.height * 0.01;
        this.move_length = this.playground.height * 0.5;
        this.damage = this.playground.height * 0.01;
        this.speed = this.playground.height * 0.4;
        this.eps = 0.1;
        this.color = "orange";
        this.player = player;
    }

    start(){
        this.player.vx = this.player.vy = 0;
        this.player.move_length = 0;
    }

    get_dist(x1,y1,x2,y2){
        let dx = (x1 - x2) * (x1 - x2);
        let dy = (y1 - y2) * (y1 - y2);
        return Math.sqrt(dx + dy);
    }

    attack(player){
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.attacked(angle, this.damage);
        this.destroy();
    }

    update(){
        if(this.eps < this.move_length){
            let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }else {
            this.destroy();
            return false;
        }
        for(let i = 0;i < this.playground.players.length;i++){
            let player = this.playground.players[i];
            let distance = this.get_dist(player.x, player.y, this.x, this.y);
            if(player !== this.player && distance <= this.radius + player.radius){
                this.attack(player);
            }
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x,this.y,this.radius, 0, Math.PI * 2, false);
        this.ctx.fill();
    }
}
class SPGamePlayGround {
    constructor(root) {
        console.log("create new PlayGround");
        this.root = root;
        this.start();
    }

    create_single_mode(color, players_num, speed, radius){
        let player = new SPGamePlayer(this,Math.random() * this.width,Math.random() * this.height, color, speed, radius, true, false);
        this.players.push(player);
        for(let i = 0;i < players_num - 1;i++){
            let robot = new SPGamePlayer(this,Math.random() * this.width, Math.random() * this.height, this.colors[i%this.colors.length], speed, radius, false, true);
            this.players.push(robot);
        }
    }

    start(){
    };

    hide(){
        this.$sp_game_playground.hide();
    }

    show(){
        this.$sp_game_playground = $(`
    <div class="sp-game-playground"></div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_playground);
        this.width = this.$sp_game_playground.width();
        this.height = this.$sp_game_playground.height();
        this.sp_game_map = new SPGameMap(this);
        this.players = []
        // this.fireballs = []
        this.colors = ["Chocolate","Crimson","DarkGoldenRod","Gainsboro","Gold","NavajoWhite","Salmon","SlateGray"];
        this.create_single_mode("MidnightBlue",10,this.height * 0.25, this.height * 0.05);

        this.$sp_game_playground.show();
    }
}
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
        this.get_info();
        this.add_listening_events_login();
        this.add_listening_events_register();
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
    remote_login(){
        let outer = this;
        const username = this.$sp_login_username.val();
        const password = this.$sp_login_password.val();
        $.ajax({
            url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/user_login/',
            type: 'POST',
            beforeSend: function(request){
                request.setRequestHeader('X-CSRFToken', outer.getCookie('csrftoken'));
            },
            data: {
                'username': username,
                'password': password,
            },
            success: function(rep){
                if(rep.result === 'success'){
                    location.reload();
                }else{
                    outer.$sp_login_error_message.html(rep.text);
                }

            }
        });
    }

    login_acapp(){
        $.ajax({
            url: "https://app3774.acapp.acwing.com.cn/superperson/settings/web/acwing/apply_code",
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
            url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/user_register/',
            type: 'POST',
            beforeSend: function(request){
                request.setRequestHeader('X-CSRFToken', outer.getCookie('csrftoken'));
            },
            data: {
                'username': username,
                'password': password,
                'password_confirm': password_confirm,
            },
            success: function(rep){
                if(rep.result === 'success'){
                    location.reload();
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

    get_info(){
        let outer = this;
        $.ajax({
            url : 'https://app3774.acapp.acwing.com.cn/superperson/settings/get_info',
            type : 'GET',
            data : {'platform': outer.platform},
            success : function(rep){
                if(rep.result === 'success'){
                    console.log("get_info success with", rep.platform);
                    // console.log(rep);
                    outer.username = rep.username;
                    outer.photo = rep.photo;
                    outer.back_img = rep.back_img;
                    outer.hide();
                    outer.root.menu.show();
                }else {
                    console.log(rep);
                    outer.login();
                }
            },
        });
    }

    hide(){
        this.$sp_index_page.hide();
    }

    show(){
        this.$sp_index_page.show();
    }
}
export class SuperPersonGame {
    constructor(id, os){
        console.log("create new SuperPersonGame");
        this.id = id;
        this.$sp_game_div = $('#' + id);
        this.os = os;
        this.login = new SPGameLogin(this);
        this.menu = new SPGameMenu(this);
        this.playground = new SPGamePlayGround(this);

        this.start();
    }

    start(){

    };
}

