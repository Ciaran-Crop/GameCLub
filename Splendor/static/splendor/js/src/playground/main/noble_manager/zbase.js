class NoblesManager {
    constructor(playground){
        this.playground = playground;
        this.sm = this.playground.shader_manager;
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

    }

    can_get_one(player){
        
    }

    start(){
        this.init_nobles();
        for(let i = 0;i < this.noblesIndex.length;i++){
            this.nobles.push(new Noble(this, origin_nobles[this.noblesIndex[i]], i));
        }
    }
}