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
            outer.hide();
            outer.root.playground.show('single mode');
        });
        this.$multi_mode.click(function(){
            outer.hide();
            outer.root.playground.show('multi mode');
        });
        this.$settings.click(function(){
            if(outer.root.login.platform === 'ACAPP'){
                outer.root.os.api.window.close();
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
class MultiPlayerSocket {
    constructor(playground){
        this.playground = playground;
        this.ws = new WebSocket("wss://app3774.acapp.acwing.com.cn/wss/multiplayer/");
        this.start();
    }
    start(){
        this.receive();
    }

    receive(){
        let outer = this;
        this.ws.onmessage = function(e){
            let data = JSON.parse(e.data);
            if(data.uuid === outer.uuid) return false;
            if(data.event === 'create_player'){
                outer.receive_create_player(data);
            }else if(data.event === 'move_to'){
                outer.receive_move_to(data);
            }else if(data.event === 'shoot_fireball'){
                outer.receive_shoot_fireball(data);
            }else if(data.event === 'attack'){
                outer.receive_attack(data);
            }else if(data.event === 'blink'){
                outer.receive_blink(data);
            }
        };
    }

    send_create_player(x, y, username, photo){
        this.ws.send(JSON.stringify({
            'uuid': this.uuid,
            'x': x,
            'y': y,
            'event': 'create_player',
            'username' : username,
            'photo' : photo,
        }));
    }

    receive_create_player(data){
        let username = data['username'];
        let photo = data['photo'];
        let uuid = data['uuid'];
        let x = data['x'];
        let y = data['y'];
        let playground = this.playground;
        let player = new SPGamePlayer(playground, x, y, 'white', 0.25, 0.05, false, false, photo, username);
        playground.players.push(player);
        player.uuid = uuid;

    }

    send_move_to(tx, ty){
        this.ws.send(JSON.stringify({
            'uuid': this.uuid,
            'tx': tx,
            'ty': ty,
            'event': 'move_to',
        }));
    }

    receive_move_to(data){
        let uuid = data['uuid'];
        let tx = data['tx'];
        let ty = data['ty'];
        let player = this.get_player(uuid);
        if(player) player.move_to(tx,ty);
    }


    send_shoot_fireball(uuid,ball_uuid, tx, ty){
        this.ws.send(JSON.stringify({
            'event': 'shoot_fireball',
            'uuid': uuid,
            'ball_uuid': ball_uuid,
            'tx': tx,
            'ty': ty,
        }));
    }



    receive_shoot_fireball(data){
        let uuid = data['uuid'];
        let ball_uuid = data['ball_uuid'];
        let tx = data['tx'];
        let ty = data['ty'];
        let player = this.get_player(uuid);
        if(player){
            let fireball = player.unleash_skills(tx, ty, 'fireball');
            fireball.uuid = ball_uuid;
        }

    }

    send_attack(attacker_uuid, attackee_uuid, ball_uuid, angle, damage, x, y){
        this.ws.send(JSON.stringify({
            'event': 'attack',
            'x': x,
            'y': y,
            'damage' : damage,
            'angle': angle,
            'ball_uuid': ball_uuid,
            'attackee_uuid': attackee_uuid,
            'uuid': attacker_uuid,
        }));
    }

    receive_attack(data){
        let x = data['x'];
        let y = data['y'];
        let damage = data['damage'];
        let angle = data['angle'];
        let ball_uuid = data['ball_uuid'];
        let attacker_uuid = data['uuid'];
        let attackee_uuid = data['attackee_uuid'];
        let attacker = this.get_player(attacker_uuid);
        let attackee = this.get_player(attackee_uuid);
        if(attacker && attackee){
            let fireball = attacker.get_fireball(ball_uuid);
            fireball.receive_attack(angle, damage, x, y, attackee);
        }
    }

    send_blink(uuid, blink_uuid, tx, ty){
        this.ws.send(JSON.stringify({
            'event': 'blink',
            'uuid': uuid,
            'blink_uuid': blink_uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(data){
        let player = this.get_player(data['uuid']);
        let tx = data['tx'];
        let ty = data['ty'];
        if(player){
            player.x = tx;
            player.y = ty;
        }
    }


    get_player(uuid){
        let players = this.playground.players;
        for(let i = 0; i < players.length;i++){
            if(players[i].uuid === uuid){
                return players[i];
            }
        }
    }

}
let SP_GAME_OBJECTS = []

class SPGameObject {
    constructor(){
        SP_GAME_OBJECTS.push(this);

        this.is_called_start = false;
        this.timedelta = 0;

        this.uuid = this.create_uuid();

    }

    create_uuid(){
        let res = "";
        for(let i = 0;i < 8; i++){
            res += Math.floor(Math.random() * 10);
        }
        return res;
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
class SPGameBoard extends SPGameObject {
    constructor(playground){
        super();
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.room_capity = 3;
        this.text = "Wating! 已就绪: " + this.playground.players.length + "人";
        this.start();
    }

    start(){

    }

    write(text){
        this.text = text;
    }

    update_text(){
        if(this.playground.players.length >= 3 && this.playground.status === 'waiting'){
            this.write("Game Fighting!");
            this.playground.status = 'fighting';
        }else if(this.playground.players.length < 3 && this.playground.status === 'waiting') {
            this.write("Waiting! 已就绪" + this.playground.players.length + "人");
        }else if(this.playground.get_me() === null && this.playground.status === 'fighting'){
            this.write("Game Over!");
            this.playground.status = 'over';
        }else if(this.playground.players.length === 1){
            this.write("End!");
            this.playground.status = 'end';
        }
    }

    update(){
        this.update_text();
        this.render();
    }

    render(){
        this.ctx.font = "48px serif";
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.text, this.playground.width / 2, 0)
    }
}
class SPGameMap extends SPGameObject{
    constructor(playground) {
        super();
        this.playground = playground;
        // 画布标签
        this.$canvas = $(`<canvas class="sp-game-map-canvas"></canvas>`);
        this.$canvas_back = $(`<div class="sp-game-map-back"></div>`);
        // 获取2D画布内容对象
        this.ctx = this.$canvas[0].getContext('2d');
        // 设置长宽
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$sp_game_playground.append(this.$canvas);
        this.playground.$sp_game_playground.append(this.$canvas_back);
        this.back_img = new Image();
        this.back_img.src = this.playground.root.login.back_img;
        this.$canvas_back.css("background-image","url(" + this.playground.root.login.back_img + ")");
}
    start(){
        this.render();
    }
    update(){
        this.render();
    }

    resize(){
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
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
        this.eps = 0.01;
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
        this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale,0, Math.PI * 2,false);
        this.ctx.fill();
    }
}
class SPGamePlayer extends SPGameObject {
    constructor(playground,x,y,color,speed,radius,is_me, is_robot, photo, username) {
        super();
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = this.vy = 0;
        this.move_length = 0;
        this.eps = 0.01;
        this.color = color;
        this.speed = speed;
        this.other_speed = 0;
        this.radius = radius;
        this.is_me = is_me;
        this.friction = 0.9;
        this.cur_skill = null;
        this.is_robot = is_robot;
        this.photo = photo;
        this.username = username;
        this.fireballs = [];
        this.fireball_cold_time_static = 2;
        this.fireball_cold_time = this.fireball_cold_time_static;
        this.fireball_img = new Image();
        this.fireball_img.src = "https://app3774.acapp.acwing.com.cn/static/superperson/images/playground/fireball.jpg";
        this.blink_cold_time_static = 10;
        this.blink_cold_time = 0;
        this.blink_img = new Image();
        this.blink_img.src = "https://app3774.acapp.acwing.com.cn/static/superperson/images/playground/blink.jpg";
        if(this.is_who() === 'me' && this.photo!== ' '){
            this.img = new Image();
            this.img.src = this.photo;
        }else if(this.is_who() === 'enemy' && this.photo !== ' '){
            this.img = new Image();
            this.img.src = this.photo;
        }
    }

    is_who(){
        if(this.is_me) return "me";
        else if(this.is_robot) return "robot";
        else return "enemy";
    }

    start(){
        if(this.is_who() === 'me') {
            this.add_listening_events();
        }else{
            if(this.is_who() === 'robot'){
                let tx = Math.random() * this.playground.width / this.playground.scale;
                let ty = Math.random() * this.playground.height / this.playground.scale;
                this.move_to(tx, ty);
            }else {

            }
        }
    }

    add_listening_events(){
        let outer = this;
        this.playground.sp_game_map.$canvas.on("contextmenu", function(){
            return false;
        });

        this.playground.sp_game_map.$canvas.mousedown(function(e){
            if(outer.playground.status !== 'fighting') return false;
            const rect = outer.ctx.canvas.getBoundingClientRect();
            let tx = (e.clientX - rect.left) / outer.playground.scale;
            let ty = (e.clientY - rect.top) / outer.playground.scale;
            if(e.which === 3){
                outer.move_to(tx, ty);
                if(outer.playground.mode === 'multi mode') outer.playground.mps.send_move_to(tx,ty);
            }else if(e.which === 1) {
                let skill = outer.unleash_skills(tx, ty, outer.cur_skill);
                if(outer.playground.mode === 'multi mode') {
                    if(skill.name === 'fireball'){
                        outer.playground.mps.send_shoot_fireball(outer.uuid,skill.uuid, tx, ty);
                    }else if(skill.name === 'blink'){
                        outer.playground.mps.send_blink(outer.uuid, skill.uuid, tx, ty);
                    }
                }
            }
        });

        $(window).keydown(function(e){
            if(outer.playground.status !== 'fighting') return false;
            if(e.which === 81){ // q
                if(outer.fireball_cold_time > outer.eps) return false;
                outer.cur_skill = "fireball";
                return false;
            }else if(e.which === 68){
                console.log('blink');
                if(outer.blink_cold_time > outer.eps) return false;
                outer.cur_skill = 'blink';
                return false;
            }
        });
    }


    unleash_skills(tx,ty, skill_name){
        let skill;
        if(skill_name === "fireball"){
            skill = this.shoot_fireball(tx,ty);
            this.fireball_cold_time = this.fireball_cold_time_static;
        }else if(skill_name === 'blink'){
            skill = this.blink(tx,ty);
            this.blink_cold_time = this.blink_cold_time_static;
        }else if(skill_name === null){
            return false;
        }
        this.cur_skill = null;
        return skill;
    }

    blink(tx, ty){
        this.x = tx;
        this.y = ty;
    }

    shoot_fireball(tx, ty){
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let fireball = new SPGameSkillFireBall(this.playground, this, this.x, this.y, angle);
        this.fireballs.push(fireball);
        return fireball;
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
        for(let i = 0;i < 10 + Math.random() * 15;i++){
            let speed = this.speed * 10;
            let radius = 0.01 * Math.random();
            let angle = Math.random() * Math.PI * 2;
            let move_length = this.radius * Math.random() * 10;
            new SPGameParticle(this.playground,angle,this.x, this.y, this.color, speed, radius, move_length);
        }
        if(this.radius < this.eps){
            this.destroy();
        }
    }

    get_fireball(uuid){
        for(let i = 0;i < this.fireballs.length;i++){
            if(this.fireballs[i].uuid === uuid){
                return this.fireballs[i];
            }
        }
    }

    update(){
        this.update_move();
        if(this.is_who() !== 'enemy' && this.playground.status === 'fighting') this.update_skill();
        this.render();
    }

    update_skill(){
        let spent_time = this.timedelta / 1000;
        this.fireball_cold_time = Math.max(0, this.fireball_cold_time - spent_time);
        this.blink_cold_time = Math.max(0, this.blink_cold_time - spent_time);
    }

    update_move(){
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
        if(this.is_who() === 'me'){

        }else{
            if(this.is_who() === 'robot'){
                let tx = Math.random() * this.playground.width / this.playground.scale;
                let ty = Math.random() * this.playground.height / this.playground.scale;
                if(this.move_length < 5 / this.playground.scale){
                    this.move_to(tx, ty);
                }
                if(this.cur_skill === null){
                    let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                    if(this.fireball_cold_time < this.eps) this.unleash_skills(player.x,player.y, "fireball");
                    if(this.blink_cold_time < this.eps) this.unleash_skills(tx, ty, 'blink');
                }
            }else {

            }
        }
    }

    render(){
        this.render_player();
        if(this.is_who() === 'me'){
            this.render_skill();
        }
    }

    render_skill(){
        this.render_fireball();
        this.render_blink();
    }


    render_blink(){
        let x = 1.7, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * this.playground.scale,y * this.playground.scale,r * this.playground.scale,0,Math.PI * 2,false);
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x - r) * this.playground.scale, (y - r) * this.playground.scale, r * 2 * this.playground.scale, r * 2 * this.playground.scale);
        this.ctx.restore();
        if(this.blink_cold_time > this.eps){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.playground.scale,y * this.playground.scale);
            this.ctx.arc(x * this.playground.scale,y * this.playground.scale,r * this.playground.scale,0 - Math.PI / 2 ,2 * Math.PI * (1 - this.blink_cold_time / this.blink_cold_time_static) - Math.PI / 2, true);
            this.ctx.lineTo(x * this.playground.scale,y * this.playground.scale);
            this.ctx.fillStyle = "rgba(0,0,255,0.6)";
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    render_fireball(){
        let x = 1.5, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * this.playground.scale,y * this.playground.scale,r * this.playground.scale,0,Math.PI * 2,false);
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * this.playground.scale, (y - r) * this.playground.scale, r * 2 * this.playground.scale, r * 2 * this.playground.scale);
        this.ctx.restore();
        if(this.fireball_cold_time > this.eps){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.playground.scale,y * this.playground.scale);
            this.ctx.arc(x * this.playground.scale,y * this.playground.scale,r * this.playground.scale,0 - Math.PI / 2 ,2 * Math.PI * (1 - this.fireball_cold_time / this.fireball_cold_time_static) - Math.PI / 2, true);
            this.ctx.lineTo(x * this.playground.scale,y * this.playground.scale);
            this.ctx.fillStyle = "rgba(0,0,255,0.6)";
            this.ctx.fill();
            this.ctx.restore();
        }

    }

    render_player(){
        if(this.is_who() === 'me' && this.photo !== ' '){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale,0,Math.PI * 2,false);
            this.ctx.strokeStyle = "white";
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * this.playground.scale, (this.y - this.radius) * this.playground.scale, this.radius * 2 * this.playground.scale, this.radius* 2 * this.playground.scale);
            this.ctx.restore();
        }else if(this.is_who() === 'robot'){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale,0,2 * Math.PI, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            this.ctx.restore();
        }else {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale,0,Math.PI * 2,false);
            this.ctx.strokeStyle = "red";
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * this.playground.scale, (this.y - this.radius) * this.playground.scale, this.radius * 2 * this.playground.scale, this.radius* 2 * this.playground.scale);
            this.ctx.restore();
        }

    }

    on_destroy(){
        if(this.is_who() === 'me'){
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
        this.name = "fireball";
        this.playground = playground;
        this.ctx = this.playground.sp_game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
        this.radius = 0.01;
        this.move_length = 0.5;
        this.damage = 0.01;
        this.speed = 0.4;
        this.eps = 0.01;
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
        if(this.playground.mode === 'multi mode' && this.player.is_who() === 'me'){
            this.playground.mps.send_attack(this.player.uuid, player.uuid, this.uuid, angle, this.damage, player.x , player.y);
        }
        this.destroy();
    }

    receive_attack(angle, damage, x, y, player){
        player.x = x;
        player.y = y;
        player.attacked(angle, damage);
        this.destroy();
    }

    update(){
        this.update_move();
        if(this.player.is_who() !== 'enemy') this.update_attack();
        this.render();
    }


    update_attack(){
        for(let i = 0;i < this.playground.players.length;i++){
            let player = this.playground.players[i];
            let distance = this.get_dist(player.x, player.y, this.x, this.y);
            if(player !== this.player && distance <= this.radius + player.radius){
                this.attack(player);
            }
        }
    }

    update_move(){
       if(this.eps < this.move_length){
            let moved = Math.min(this.speed * this.timedelta / 1000, this.move_length);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }else {
            this.destroy();
            return false;
        }
    }

    render(){
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale, 0, Math.PI * 2, false);
        this.ctx.fill();
    }

    on_destroy(){
        let fireballs = this.player.fireballs;
        for(let i = 0;i < fireballs.length;i++){
            if(fireballs[i] === this){
                fireballs.splice(i, 1);
                break;
            }
        }
    }
}
class SPGamePlayGround {
    constructor(root) {
        this.root = root;
        this.$sp_game_playground = $(`
    <div class="sp-game-playground"></div>
`);
        this.hide();
        this.root.$sp_game_div.append(this.$sp_game_playground);
        this.start();
    }

    create_single_mode(color, players_num, speed, radius){
        let player = new SPGamePlayer(this,Math.random() * this.width / this.scale,Math.random() * this.height / this.scale, color, speed, radius, true, false, this.root.login.photo, this.root.login.username);
        this.players.push(player);
        for(let i = 0;i < players_num - 1;i++){
            let robot = new SPGamePlayer(this,Math.random() * this.width / this.scale, Math.random() * this.height / this.scale, this.colors[i%this.colors.length], speed, radius, false, true);
            this.players.push(robot);
        }
    }

    create_multi_mode(color, players_num, speed, radius){
        let outer = this;
        let x = Math.random() * this.width / this.scale;
        let y = Math.random() * this.height / this.scale;
        let player = new SPGamePlayer(this, x, y, color, speed, radius, true, false, this.root.login.photo, this.root.login.username);
        this.players.push(player);
        this.mps = new MultiPlayerSocket(this);
        this.mps.uuid = this.players[0].uuid;

        this.mps.ws.onopen = function(){
            outer.mps.send_create_player(x, y, outer.root.login.username, outer.root.login.photo, 'false');
        }
    }

    start(){
        let outer = this;
        $(window).resize(function(){
            outer.resize();
        });
    };

    hide(){
        this.$sp_game_playground.hide();
    }

    resize(){
        this.width = this.$sp_game_playground.width();
        this.height = this.$sp_game_playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;

        if(this.sp_game_map) this.sp_game_map.resize();
    }
    show(mode){
        this.players = []
        this.sp_game_map = new SPGameMap(this);
        this.status = 'waiting' // waiting -> fighting -> over -> end
        this.sp_game_board = new SPGameBoard(this);
        this.resize();
        this.colors = ["Chocolate","Crimson","DarkGoldenRod","Gainsboro","Gold","NavajoWhite","Salmon","SlateGray"];
        this.mode = mode;
        if(mode === 'single mode'){
            this.create_single_mode("MidnightBlue",10,0.25, 0.05);
        }else if(mode === 'multi mode'){
            this.create_multi_mode("MidnightBlue",10,0.25, 0.05);
        }

        this.$sp_game_playground.show();
    }

    get_me(){
        for(let i = 0;i < this.players.length;i++){
            if(this.players[i].is_who() === 'me'){
                return this.players[i];
            }
        }
        return null;
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
        if(this.platform === 'ACAPP'){
            this.acapp_getinfo();
        }else {
            this.get_info();
            this.add_listening_events_login();
            this.add_listening_events_register();
        }
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
            url: "https://app3774.acapp.acwing.com.cn/superperson/settings/web/acwing/apply_code/",
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

    acapp_login(appid, redirect_uri, scope, state){
        let outer = this;
        outer.root.os.api.oauth2.authorize(appid, redirect_uri, scope, state, function(rep){
            if(rep.result === 'success'){
                outer.username = rep.username;
                outer.photo = rep.photo;
                outer.back_img = rep.back_img;
                outer.hide();
                outer.root.menu.show();
            }else{
            }
        });
    }

    acapp_getinfo(){
        let outer = this;
        $.ajax({
            url: 'https://app3774.acapp.acwing.com.cn/superperson/settings/acwing/acwing/apply_code/',
            type: 'GET',
            success: function(rep){
                if(rep.result === 'success'){
                    let appid = rep.appid;
                    let redirect_uri = rep.redirect_uri;
                    let scope = rep.scope;
                    let state = rep.state;
                    outer.acapp_login(appid, redirect_uri, scope, state);
                }
            }
        });
    }

    get_info(){
        let outer = this;
        $.ajax({
            url : 'https://app3774.acapp.acwing.com.cn/superperson/settings/get_info',
            type : 'GET',
            data : {'platform': outer.platform},
            success : function(rep){
                if(rep.result === 'success'){
                    outer.username = rep.username;
                    outer.photo = rep.photo;
                    outer.back_img = rep.back_img;
                    outer.hide();
                    outer.root.menu.show();
                }else {
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

