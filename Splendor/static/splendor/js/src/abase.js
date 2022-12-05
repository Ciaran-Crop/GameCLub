
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
        })}, 4.5 * 60 * 1000);
}

function clear_tokens(){
    localStorage.setItem('gc-access', '');
    localStorage.setItem('gc-refresh', '');
}

