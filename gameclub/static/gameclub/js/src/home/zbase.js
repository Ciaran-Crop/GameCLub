export class GameClubSpan {
    constructor(id, os){
        this.id = id;
        this.os = os;
        this.$root_div = $("#" + this.id);
        this.$span_div = $(`
<div class="gc-home-span">
    个人空间
    <div class="gc-home-span-signout">
        <button>退出</button>
    </div>
</div>
`);
        this.$root_div.append(this.$span_div);
        this.start();
    }

    start(){
        this.$signout_button = this.$span_div.find('.gc-home-span-signout > button');
        this.get_info();
        this.add_listening_events();
    }

    add_listening_events(){
        this.$signout_button.on('click', () => {
            clear_tokens();
            window.location.href = `${BASE_URL}/`;
        });
    }

    padding_info(rep){
        console.log(rep);
    }

    get_info(){
        $.ajax({
            url : `${BASE_URL}/gameclub/auth/get_info/`,
            type : 'post',
            headers : {
                'Authorization': "Bearer " + localStorage.getItem('gc-access'),
            },
            success : rep => {
                refresh_tokens();
                this.padding_info(rep);
            },
            error : () => {
                window.location.href = `${BASE_URL}/`;
            }
        });
    }
}
