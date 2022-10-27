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
