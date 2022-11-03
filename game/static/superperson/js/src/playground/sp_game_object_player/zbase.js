class SPGamePlayer extends SPGameObject {
    constructor(playground,x,y,color,speed,radius,is_me, is_robot) {
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
        if(this.is_me && this.playground.root.login.photo !== ' '){
            this.img = new Image();
            this.img.src = this.playground.root.login.photo;
        }
    }

    start(){
        if(this.is_me) {
            this.add_listening_events();
        }else{
            if(this.is_robot){
                let tx = Math.random() * this.playground.width / this.playground.scale;
                let ty = Math.random() * this.playground.height / this.playground.scale;
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
                outer.move_to((e.clientX - rect.left) / outer.playground.scale,(e.clientY - rect.top) / outer.playground.scale);
            }else if(e.which === 1) {
                outer.unleash_skills((e.clientX - rect.left) / outer.playground.scale, (e.clientY - rect.top) / outer.playground.scale, outer.cur_skill);

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

    player_collide(player){
        if(this.vs === 0) this.vx = player.vx;
        else this.vx = -this.vx;
        if(this.vy === 0) this.vy = player.vy;
        else this.vy = -this.vy;
        this.move_length = 0;
        this.other_speed = this.speed * 2;
    }

    update(){
        this.update_move();
        this.render();
    }

    update_move(){
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
                let tx = Math.random() * this.playground.width / this.playground.scale;
                let ty = Math.random() * this.playground.height / this.playground.scale;
                if(this.move_length < 5 / this.playground.scale){
                    this.move_to(tx, ty);
                }
                if(this.cur_skill === null && Math.random() < 1 / (20.0 * this.playground.players.length)){
                    let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
                    this.unleash_skills(player.x,player.y, "fireball");

                }
            }
        }
    }

    render(){
        if(this.is_me && this.playground.root.login.photo !== ' '){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale,0,Math.PI * 2,false);
            this.ctx.strokeStyle = "white";
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * this.playground.scale, (this.y - this.radius) * this.playground.scale, this.radius * 2 * this.playground.scale, this.radius* 2 * this.playground.scale);
            this.ctx.restore();
        }else{
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale,0,2 * Math.PI, false);
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
