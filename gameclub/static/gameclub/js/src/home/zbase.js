export class GameClubSpan {
    constructor(id, os){
        this.id = id;
        this.os = os;
        this.$root_div = $("#" + this.id);
        this.$span_div = $(`
<div class="gc-home-span">
    个人空间
</div>
`);
        this.$root_div.append(this.$span_div);
        this.start();
    }

    start(){
        this.get_info();
    }

    padding_info(rep){
        console.log(rep);
    }

    get_info(){
        $.ajax({
            url : `${BASE_URL}/gameclub/home/get_info/`,
            type : 'post',
            headers : {
                'Authorization': "Bearer " + localStorage.getItem('gc-access'),
            },
            success : rep => {
                this.padding_info(rep);
            },
            error : () => {
                window.location.href = `${BASE_URL}/`;
            }
        });
    }
}
