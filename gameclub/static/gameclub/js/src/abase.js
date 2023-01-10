const BASE_URL = "https://app3774.acapp.acwing.com.cn";

function refresh_tokens(){
    setInterval(() => {
        $.ajax({
            url: `${BASE_URL}/gameclub/auth/jwt/token/refresh/`,
            type: 'POST',
            data: {
                'refresh': localStorage.getItem('gc-refresh'),
            },
            success: rep => {
                localStorage.setItem('gc-access', rep.access);
            }
        })}, 59 * 60 * 1000);
}

function refresh_() {
    $.ajax({
        url: `${BASE_URL}/gameclub/auth/jwt/token/refresh/`,
        type: 'POST',
        data: {
            'refresh': localStorage.getItem('gc-refresh'),
        },
        success: rep => {
            localStorage.setItem('gc-access', rep.access);
        }
    });
}

function clear_tokens(){
    localStorage.setItem('gc-access', '');
    localStorage.setItem('gc-refresh', '');
}

function hexFromRGB(r, g, b) {
    var hex = [
        parseInt(r).toString( 16 ),
        parseInt(g).toString( 16 ),
        parseInt(b).toString( 16 )
    ];
    $.each( hex, function( nr, val ) {
        if ( val.length === 1 ) {
            hex[ nr ] = "0" + val;
        }
    });
    return hex.join( "" ).toUpperCase();
}
