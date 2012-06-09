//room info
var Network = require('./network'),
    Game = require('./game'),
    EventEmitter = process.EventEmitter;

var room_next_id = 1000;
var room_list = [];

function Room(title)
{
    var newroom = {
        id: room_next_id++,
        is_in_game: false,            // 判断改房间的游戏是否已经开始
        players: [],
        map: 0,
        title: title,
        game: null
    };
    room_list.push(newroom);
    newroom.__proto__ = Room.prototype;
    return newroom;
}
Room.prototype.gen_msg = function () {
    var _players = [];
    for(var i = 0; i < this.players.length; i++)
        _players.push(this.players[i].gen_msg());
    return {
        title: this.title,
        id: this.id,
        players: _players
    };
}
Room.prototype.add_player = function (player) {
    player.room = this;
    this.players.push(player);
  //  this.refresh();
  //  Room.refresh();
}
Room.prototype.quit_player = function (player) {
    if(this.game != null) {
        this.game.quit_player(player);
    }
    this.players.remove(player);
    this.refresh();
    var remain = 0;
    for(var i = 0; i < this.players.length; i++) {
        if(!this.players[i].isAI) {
            remain++;
        }
    }
    if(remain == 0) {
        room_list.remove(this);
        if(this.game != null)
            this.game.end();
        Room.refresh();
    }
}

Room.prototype.check_start_game = function () {
    var i = 0;
    for(i = 0; i < this.players.length; i++) {
        if(this.players[i].status == "未准备")
            break;
    }
    if(i == this.players.length && i > 1) {
        this.is_in_game = true;  //     表示游戏已经开始了
        this.game = new Game(this);
        this.game.start();
     /*
         for(i = 0; i < this.players.length; i++) {
            this.players[i].socket.volatile.emit('game_refresh',"");
            }
     */
            Network.emit("game_start","");
            console.log("game_start"); //game.gen_msg(i)
    }
}


Room.prototype.refresh = function () {
    Network.emit("refresh_room", this.gen_msg());
}
Room.refresh = function () {
    if(room_list.length>0)
    {
    //console.log("@@@Room refresh");
    //console.log(this.gen_msg());    
    Network.emit("refresh_hall", this.gen_msg());    // 更新大厅room 信息
    
    }
    //this -> room 
    
    //console.log("@@@Room refresh");
    //console.log(this.gen_msg());    
}

// for room list 

Room.gen_msg = function () {
    var res = [];
    for(var i = 0; i < room_list.length; i++) {
        if( !room_list[i].is_in_game) {                 // 修改, 如果还没有开始，就发送给客户端
            res.push(room_list[i].gen_msg());
        }
    }
    return res;
}
//查找id 所在的房间
Room.find = function (id) {
    for(var i = 0; i < room_list.length; i++) {
        if(room_list[i].id == id)
            return room_list[i];
    }
    return null;
}

exports = module.exports = Room;
