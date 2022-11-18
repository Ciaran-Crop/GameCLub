class GameClubIndexBack {
    constructor(root){
        this.root = root;
        this.$back = $(`<div class="gc-index-back"></div>`);
        this.root.$gc_index.append(this.$back);
        this.start();
    }

    start(){}
}
