class PlayersManager {
    constructor(playground){
        this.playground = playground;
        this.sm = this.playground.shader_manager;
        this.number = this.playground.player_number;
        this.players_config = [];
        this.players = [];
        this.roundi = 0;
        this.start();
    }

    start(){
        for(let i in this.playground.players){
            let p = this.playground.players[i];
            this.players_config.push({
                email: p.email,
                name: p.name,
                photo: p.photo,
                character: p.character,
                game_score: p.game_score,
                score: p.score,
            });
        }
        for(let i = 0;i < this.number;i++){
            this.players.push(new Player(this, this.players_config[i], i));
        }
    }

    next_player(){
        this.roundi = (this.roundi + 1) % this.number;
    }

    player_buy(player, card){

    }

    player_book(player, book){

    }
    
    player_noble(player, noble){

    }
    
    player_pick(player, tokens){
        
    }
}