class NoblesManager {
    constructor(playground){
        this.playground = playground;
        this.sm = this.playground.shader_manager;
        this.am = this.playground.am;
        this.gl = this.playground.gl;
        this.nobleLength = Math.min(4, this.playground.player_number + 1);
        this.noblesIndex = [];
        this.nobles = [];
        this.start();
    }

    init_nobles(){
        if (this.playground.mode !== '单人') {
            this.init_nobles_from_web();
        } else {
            // single init
            this.init_nobles_from_local();
        }
    }

    init_nobles_from_local(){
        let base_nobles = [];
        for (let i = 0; i < origin_nobles.length; i++) {
            base_nobles.push(i);
        }
        base_nobles.sort(() => {
            return (0.5 - Math.random());
        });
        this.noblesIndex = base_nobles.slice(0, this.nobleLength);
    }

    init_nobles_from_web(){
        let base_nobles = this.playground.config['base_nobles'];
        this.noblesIndex = base_nobles.slice(0, this.nobleLength);
    }

    can_get_one(player){
        if(!player.can_get_one()) return false;
        let flag = -1;
        for(let i in this.nobles){
            let noble = this.nobles[i];
            let spend = noble.noble_config.spend;
            let can_get = true;
            for(let key in spend){
                let color = spend[key].color;
                let need = spend[key].need;
                let has = player.cards[color];
                if(has < need){
                    can_get = false;
                    break;
                }
            }
            if(can_get){
                flag = i;
                break;
            }
        }
        if(flag === -1){
            return false;
        }
        // let flag = 0;
        let noble = this.nobles[flag];
        this.nobles.splice(flag, 1);
        noble.change_scale(0.3);
        noble.change_state('player');
        noble.role = player.email;
        const gl = this.gl;
        let x_step = fix(gl, noble_move_x_step, true);
        let y_step = fix(gl, noble_move_y_step, false);
        noble.move_to(player.x +x_step, player.y + y_step);
        this.am.play_func.splendor_buynoble();
        player.update_nobles(noble);
        return true;
    }

    start(){
        this.init_nobles();
        for(let i = 0;i < this.noblesIndex.length;i++){
            this.nobles.push(new Noble(this, origin_nobles[this.noblesIndex[i]], i));
        }
    }
}