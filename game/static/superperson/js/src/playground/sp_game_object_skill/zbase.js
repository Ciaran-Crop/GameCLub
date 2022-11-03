class SPGameSkillFireBall extends SPGameObject {
    constructor(playground, player, x, y, angle) {
        super();
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
        this.ctx.arc(this.x * this.playground.scale,this.y * this.playground.scale,this.radius * this.playground.scale, 0, Math.PI * 2, false);
        this.ctx.fill();
    }
}
