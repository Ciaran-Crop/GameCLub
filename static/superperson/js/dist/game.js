class SPGameMenu {
    constructor(root) {
        this.root = root;
        this.$sp_game_menu = $(`
<div class="sp-game-menu">
    <div class="sp-game-menu-field">
        <div class="sp-game-menu-item sp-game-menu-item-single-mode">单人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-multi-mode">多人模式</div>
        <div class="sp-game-menu-item sp-game-menu-item-settings">设置</div>
    </div>
</div>
`);
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
            console.log("click settings");
        });
    }
    show(){
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
    }
    start(){
        this.render();
    }
    update(){
        this.render();
    }
    render(){
        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.fillRect(0,0,this.playground.width,this.playground.height);
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
                if(this.cur_skill === null && Math.random() < 1 / 300.0){
                    let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                    this.unleash_skills(player.x,player.y, "fireball");

                }
            }
        }
        this.render();
    }

    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
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
export class SuperPersonGame {
    constructor(id){
        console.log("create new SuperPersonGame");
        this.id = id;
        this.$sp_game_div = $('#' + id);
        this.menu = new SPGameMenu(this);
        this.playground = new SPGamePlayGround(this);

        this.start();
    }

    start(){

    };
}

