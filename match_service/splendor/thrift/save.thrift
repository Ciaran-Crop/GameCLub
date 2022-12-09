namespace py splendor_save

struct SplendorPlayer {
    1: string email,
    2: string channel_name,
    3: i32 score,
    4: i32 waiting_time,
}

service SplendorSave {
    i32 save_data(1: list<SplendorPlayer> players),
}
