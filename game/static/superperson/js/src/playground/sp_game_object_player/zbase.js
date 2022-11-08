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
