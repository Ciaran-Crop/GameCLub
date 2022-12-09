namespace py splendor_match

struct SplendorPlayer {
    1: string email,
    2: string channel_name,
    3: i32 score,
    4: i32 waiting_time,
}

service SplendorMatch {
    i32 add_player(1: SplendorPlayer player, 2: string info),
    i32 remove_player(1: SplendorPlayer player, 2: string info),
}
