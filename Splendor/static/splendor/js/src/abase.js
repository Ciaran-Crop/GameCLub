const BASE_URL = "https://app3774.acapp.acwing.com.cn";

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

function refresh_tokens() {
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
        })
    }, 59 * 60 * 1000);
}

function clear_tokens() {
    localStorage.setItem('gc-access', '');
    localStorage.setItem('gc-refresh', '');
}

function fix(gl, a, isWidth, options) {
    let len = gl.canvas.clientWidth;
    if (!isWidth) {
        len = gl.canvas.clientHeight;
    }
    if(options){
        let pre_size = options.pre_size;
        let pre_width = pre_size[0];
        let pre_height = pre_size[1];
        a = (isWidth ? a / pre_width: a / pre_height);
    }
    return a * len;
}

const base_width = 1536;
const base_height = 760;

// token
const token_offset_x = 970 / base_width;
const token_offset_y = 100 / base_height;
const token_offset_y_step = 115 / base_height;
const token_offset_y_t_step = 5 / base_height;
const token_width = 70 / base_width;
const token_height = 60 / base_height;
const token_move_length = 900 / base_width;
const token_dis_top = 5 / base_height;
const token_score_t_step_x = 15 / base_width;
const token_score_t_step_y = 15 / base_height;
const token_score_scale_x = 40 / base_width;
const token_score_scale_y = 40 / base_height;
const token_speed = 800 / base_width;

// player
const player_y_step = 160 / base_height;
const player_x = 1285 / base_width;
const player_y = 77 / base_height;
const player_book_x_step = 5 / base_width;
const player_book_card_step = 45 / base_width;
const player_book_y_fix_step = 90 / base_height;
const player_photo_x_step = 10 / base_width;
const player_photo_y_step = 10 / base_height;
const player_card_x_step = 10 / base_width;
const player_card_y_step = 10 / base_height;
const player_card_card_x_step = 35 / base_width;
const player_card_fix_x_step = 25 / base_width;
const player_card_fix_y_step = 5 / base_height;
const player_card_gem_scale_x = 10 / base_width;
const player_card_gem_scale_y = 10 / base_height;
const player_card_score_scale_x = 35 / base_width;
const player_card_score_scale_y = 35 / base_height;
const player_token_x_step = 42 / base_width;
const player_token_y_step = 50 / base_height;
const player_token_x_fix_step = 5 / base_width;
const player_token_y_fix_step = 3 / base_height;
const player_noble_x_step = 155 / base_width;
const player_noble_y_step = 100 / base_height;
const player_noble_scale_x = 40 / base_width;
const player_noble_scale_y = 40 / base_height;
const player_top_back_x = 260 / base_width;
const player_top_back_y = 150 / base_height;

// noble
const noble_move_x_step = 155 / base_width;
const noble_move_y_step = 100 / base_height;
const noble_offset_x = 1070 / base_width;
const noble_offset_y = 75 / base_height;
const noble_y_step = 175 / base_height;
const noble_speed = 800 / base_width;
const noble_score_x_step = 90 / base_width;
const noble_top_back_x_step = 54 / base_width;
const noble_top_back_scale_x = 140 / base_height;
const noble_top_back_scale_y = 54 / base_width;
const noble_t_step = 45 / base_height;
const noble_fix_step = 10 / base_width;
const noble_x_fix_step = 10 / base_width;
const noble_y_fix_step = 145 / base_height;
const noble_score_scale_x = 35 / base_width;
const noble_score_scale_y = 35 / base_height;
const noble_gem_scale_x = 15 / base_width;
const noble_gem_scale_y = 15 / base_height;

// card
const card_next_card_offset_x = 20 / base_width;
const card_next_card_offset_y = 75 / base_height;
const card_next_card_x_step = 190 / base_width;
const card_next_card_y_step = 238 / base_height;
const card_speed = 1000 / base_width;
const card_width = 150 / base_width;
const card_height = 203 / base_height;
const card_gem_step = 98 / base_width;
const card_spend_step = 100 / base_height;
const card_gem_step_x = 40 / base_width;
const card_gem_step_y = 15 / base_height;
const card_fix_step_x = 50 / base_width;
const card_fix_step_y = 50 / base_height;
const card_gem_scale_x = 20 / base_width;
const card_gem_scale_y = 20 / base_height;
const card_click_fix_x = 180 / base_width;
const card_click_fix_y = 90 / base_height;

// shader
const shader_player_photo_scale_x = 30 / base_width;
const shader_player_photo_scale_y = 30 / base_height;
const shader_card_back_scale_x = 150 / base_width;
const shader_card_back_scale_y = 203 / base_height;
const shader_top_back_scale_x = 150 / base_width;
const shader_top_back_scale_y = 54 / base_height;
const shader_score_scale_x = 50 / base_width;
const shader_score_scale_y = 50 / base_height;
const shader_mini_card_back_scale_x = 35 / base_width;
const shader_mini_card_back_scale_y = 35 / base_height;
const shader_gem_scale_x = 45 / base_width;
const shader_gem_scale_y = 45 / base_height;
const shader_gem_fix_x_step = 2.5 / base_width;
const shader_gem_fix_y_step = 2.5 / base_height;
const shader_spend_scale_x = 50 / base_width;
const shader_spend_scale_y = 50 / base_height;
const shader_token_scale_x = 70 / base_width;
const shader_token_scale_y = 70 / base_height;
const shader_noble_scale_x = 140 / base_width;
const shader_noble_scale_y = 140 / base_height;

