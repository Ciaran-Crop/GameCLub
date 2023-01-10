export class GameClubIndex {
    constructor(id, os, access, refresh, redirect) {
        this.id = id;
        this.os = os;
        this.redirect = redirect
        if (!localStorage.getItem('gc-access')) {
            localStorage.setItem('gc-access', access);
        }
        if (!localStorage.getItem('gc-refresh')) {
            localStorage.setItem('gc-refresh', refresh);
        }
        refresh_();
        this.$gc_index = $(`
<div class='gc-index'>
</div>
`);
        this.$root_div = $('#' + id);
        this.$root_div.append(this.$gc_index);
        this.start();
    }

    start() {
        // create back
        this.back = new GameClubIndexBack(this);
        // create login box
        this.login_box = new GameClubIndexLogin(this);
    }

}
