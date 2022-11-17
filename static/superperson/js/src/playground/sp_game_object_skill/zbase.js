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
