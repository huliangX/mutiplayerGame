/* 
main Entrance  
*/ 
require('./utils');
var Network = require('./network'),
    Game = require('./game'),
    Room = require('./room'),
    Player = require('./player'),
    Config = require('./config');

var usersWS = [];  //未加入room 的player

Network.on('connection', function (socket) {


    //更新大厅信息
    /*
    Room.refresh();

    socket.on('create', function (data) {
        socket.get('playerinfo', function (err, player) {
            if(player == null) {
                var player = new Player(socket, data);
            }
            socket.set('playerinfo', player, function () {
                var room = new Room(player.name + '的房间');
                socket.emit("reply_create", {suc: true, data: room.gen_msg()});
                room.add_player(player);
            });
        });
    });


    socket.on('join', function (data) {


        socket.get('playerinfo', function (err, player) {
            if(player == null) {
                var player = new Player(socket, data);
            }
            socket.set('playerinfo', player, function () {
                var room = Room.find(data.id);
                if(room == null) {
                    socket.emit("replay_join", {suc: false, data: '房间不存在。'});
                } else {
                    socket.emit("reply_join", {suc: true, data: room.gen_msg()});
                    player.room = room;
                    room.add_player(player);
                }
            });
        });
    });

    socket.on('ready', function () {
        socket.get('playerinfo', function (err, player) {
            if(player != null) {
                socket.emit("reply_ready", {suc: true});
                player.status = "已准备";
                player.room.refresh();
                player.room.check_start_game();             //有待修改
            }
        });
    });

    socket.on('quit', function () {
        socket.get('playerinfo', function (err, player) {
            if(player != null) {
                socket.emit("reply_quit", {suc: true});
                player.quit();
            }
        });
    })
    socket.on('disconnect', function () {
        socket.get('playerinfo', function (err, player) {
            if(player != null) {
                player.quit();
            }
        });
    });
*/





    socket.on('register', function (data) {

        socket.get('playerinfo', function (err, player) {
                if(player == null) {
                    console.log("[new player]",data.name);
                    var player = new Player(socket, data);
                }


    //这个id 作为player的唯一标示符号

                socket.set('playerinfo', player, function () {
                usersWS.push(player);
                console.log("[wait player numer]",usersWS.length);

                if(usersWS.length>1)
                {
                    var p1 = usersWS[0];
                    var p2 = usersWS[1];   
                    if(p1.isMain + p2.isMain != 3)     
                    {
                        p1.isMain = 1;
                        p2.isMain = 2;
                    }
                    var room = new Room(player.name + '的房间');

                    //socket.emit("reply_create", {suc: true, data: room.gen_msg()});
                    if( p1.isMain ==1)
                    {
                    room.add_player(p1);                
                    room.add_player(p2);
                    }
                    else
                    {
                    room.add_player(p2);                
                    room.add_player(p1);                 
                    }

                    usersWS.splice(0,2);
                    console.log("[wait player numer]",usersWS.length);                
                    console.log("GameStart");
                    p1.socket.emit('GameStart', {me:p1.isMain});
                    p2.socket.emit('GameStart', {me:p2.isMain});
                 

                }//if

                }); //set


        }); //get
    })    //socket.on


    socket.on('sync', function (data) {
        socket.get('playerinfo', function (err, player) {
                if(player != null) {
                    //var target = usersWS[i].socket;
                    var room = player.room;
                    for(var i=0;i<room.players.length;i++)
                    {
                           if(room.players[i].id ==player.id) 
                            {
                                console.log("this is msg from id:",room.players[i].id)
                               
                            }
                            else
                            {
                            room.players[i].socket.emit('sync', data);
                            console.log("send to id:",room.players[i].id)
                            }
                    }
/*
                    if(player.isMain ==1 )
                        room.players[1].socket.emit('sync', data);
                    else
                        room.players[0].socket.emit('sync', data);                        
*/              
                }//if
               else
               {
                socket.emit('error',"no session");
               } 


            }); //get

            
            // socket.broadcast.emit('sync',data);
           //  socket.broadcast.json.send({ a: 'message' });
        }); //socket.on

});    //Network.on

