let last_timestamp, GAME_OBJECTS = [];
class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        this.is_called_start = false;
        this.timedelta = 0;
        this.uuid = this.create_uuid();
    }
    create_uuid() {
        let t = "";
        for (let s = 0; s < 8; s++)
            t += Math.floor(10 * Math.random());
        return t;
    }
    start() {}
    update() {}
    late_update() {}
    on_destroy() {}
    destroy() {
        this.on_destroy();
        for (let t = 0; t < GAME_OBJECTS.length; t++)
            if (GAME_OBJECTS[t] === this) {
                GAME_OBJECTS.splice(t, 1);
                break
            }
    }
}

