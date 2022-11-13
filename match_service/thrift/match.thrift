namespace py match_service

struct Player {
    1: string uuid,
    2: string username,
    3: string channel_name,
    4: i32 score,
    5: i32 waiting_time,
    6: double x,
    7: double y,
    8: string photo
}

service Match {
    i32 add_player(1: Player player),
}
