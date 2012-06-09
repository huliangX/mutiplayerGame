//player info
var EventEmitter = process.EventEmitter;

var player_next_id = 0;

function Player(socket, data)
{
    var newplayer = {
        socket: socket,
        id: player_next_id++,
        tankType: 0,
        name: data.name,
        isMain: data.isMain,
        ip: socket.remoteAddress,
        status: '未准备',
//        isAI: false,
        room: null
    };
    newplayer.__proto__ = Player.prototype;
    return newplayer;
}
Player.prototype.gen_msg = function () {
    return {
        id: this.id,
        cartype: this.cartype,
        name: this.name,
        ip: this.ip,
        status: this.status,
        ai: this.isAI
    };
}
Player.prototype.quit = function () {
    if(this.room != null) {
        this.room.quit_player(this);
        this.room = null;
    }
}

exports = module.exports = Player;