var Config = require('./config'),
    Network = require('./network'),
    KeyStatus = require('./key_status');

var now = function () {
    return new Date().getTime();
}

var _car_cache = {};
var _get_car = function (tp) {
    if(_car_cache[tp] == null) {
        _car_cache[tp] = require('./models/cars/' + tp);
    }
    return _car_cache[tp];
}
var _map_cache = {};
var _get_map = function (map) {
    if(_map_cache[map] == null) {
        _map_cache[map] = require('./models/maps/' + map);
    }
    return _map_cache[map];
}

function Game (room) {
    var _map_model = _get_map(room.map);   // 空战 海战 宇宙
    var _players = []; 
    var _cars = _map_model.initialize_cars(room.players.length);
    var _boxes = _map_model.initialize_boxes(room.players.length);

    //1. create physics world  ( map )

    var __players = [];
    var __cars = [];
    var __boxes = [];

    for(var i = 0; i < room.players.length; i++) {
        _players.push({
             hp: 3,       // health pointer
             cd: 0,       // cd 
             key: new KeyStatus()
        });
        //2. draw play ( room.players ) 

        __players.push({hp: 3});

    }

    var res = {
        start_time: null,
        ended: 0,
        map: room.map,
        players: _players,
        room: room,
        world: {
            sign_time: null,
            cars: _cars,
            traps: [],
            missiles: []
        },
        msg: {
            end: 0,
            lst: 0,
            idx: -1,
            its: 0,
            v: 0,
            cd: 0,
            map: room.map,
            pls: __players,
            wld: {
                bxs: __boxes,
                crs: __cars,
                tps: [],
                mss: []
            }
        }
    };
    res.__proto__ = Game.prototype;
    return res;
}
Game.prototype.start = function () {
    var game = this;
    game.start_time = game.world.sign_time = now();
    game.ticker = setInterval(function () {
        game.run();
        for(var i = 0; i < game.room.players.length; i++) {
            /*
            if(game.room.players[i].isAI) {
                game.room.players[i].run(game, i);
            } else {

                game.room.players[i].socket.volatile.emit('game_refresh', game.gen_msg(i));
            }
            */

            // sned msg to refresh client's game start 

            //告诉client refresh

            game.room.players[i].socket.volatile.emit('game_refresh', "");
            // 自己refresh

        }
        if(game.ended) {
            game.end();
            setTimeout(function () {
                for(var i = 0; i < game.room.players.length; i++) {

                    /*
                    if(!game.room.players[i].isAI) {
                        game.room.players[i].socket.emit('game_end');
                    }
                    */
                     game.room.players[i].socket.emit('game_end');
                }
                game.room.refresh();
            }, 3000);
        }
    }, 1000 / Config.fps);  //setInterval       每秒执行的次数
    Network.emit('game_start', game.room.gen_msg());
}



Game.prototype.end = function () {
    clearInterval(this.ticker);
    this.room.game = null;
    for(var i = 0; i < this.room.players.length; i++) {
        /*
        if(this.room.players[i].isAI) {
            this.room.players.splice(i, 1);
            i--;
        } else {
            this.room.players[i].status = '未准备';
        }
        */
        this.room.players[i].status = '未准备';
    }
}
Game.prototype.refresh_key_status = function (room_player, data) {
    this.players[this.room.players.indexOf(room_player)].key.status = data;
}

exports = module.exports = Game;


/*
var hit = function (a, b, dis) {
    var _testCount = 20 / Config.fps;
    var apx = a.px || a.x;
    var apz = a.pz || a.z;
    var bpx = b.px || b.x;
    var bpz = b.pz || b.z;
    var _pax = (a.x - apx) / _testCount;
    var _paz = (a.z - apz) / _testCount;
    var _pbx = (b.x - bpx) / _testCount;
    var _pbz = (b.z - bpz) / _testCount;
    for(var i = 0; i < _testCount; i++) {
        apx += _pax;
        apz += _paz;
        bpx += _pbx;
        bpz += _pbz;
        if(Math.sqrt((apx - bpx) * (apx - bpx) + (apz - bpz) * (apz - bpz)) <= dis) {
            return true;
        }
    }
    return false;
}
*/


// 游戏主循环
Game.prototype.run = function () {

    var world = this.world;
    var current_time = now();
    world.last_time = current_time - world.start_time;
    var time = (current_time - world.sign_time) / 100;
    var map_model = _get_map(this.map);
    
    var players = this.players;
    
    //运动
    for(var i = 0; i < world.boxes.length; i++) {
        world.boxes[i].d = (world.boxes[i].d + Math.PI * time / 30) % (Math.PI * 2);
    }
    for(var i = 0; i < world.missiles.length; i++) {
        world.missiles[i].px = world.missiles[i].x;
        world.missiles[i].pz = world.missiles[i].z;
        world.missiles[i].x += world.missiles[i].xv * time;
        world.missiles[i].z += world.missiles[i].zv * time;
    }
    for(var i = 0; i < players.length; i++) {
        var car_model = _get_car(world.cars[i].type);
        //前进方向分速度
        var _V = -Math.sin(world.cars[i].d) * world.cars[i].xv + Math.cos(world.cars[i].d) * world.cars[i].zv;
        var _XV = -Math.sin(world.cars[i].d) * _V;
        var _ZV = Math.cos(world.cars[i].d) * _V;
        //漂移方向分速度
        var _xv = world.cars[i].xv - _XV;
        var _zv = world.cars[i].zv - _ZV;
        if(players[i].hp > 0) {
            //推力
            var _F = 0;
            if(players[i].key.onlyup) {
                if(_V > 0) {
                    if(_V < map_model.min_V)
                        _V = map_model.min_V;
                    _F = car_model.P / _V;
                } else {
                    _F = car_model.P / map_model.min_V;
                }
            } else if(players[i].key.onlydown) {
                if(_V < 0) {
                    if(_V > -map_model.min_V)
                        _V = -map_model.min_V;
                    _F = car_model.P / _V;
                } else {
                    _F = car_model.P / -map_model.min_V;
                }
            }
            //x、z方向分加速度((阻力 + 推动力) / 质量)
            var xf = _XV * _XV * map_model.K * car_model.M + _xv * _xv * map_model._K * car_model.M;
            if(world.cars[i].xv > 0)
                xf = -xf;
            var zf = _ZV * _ZV * map_model.K * car_model.M + _zv * _zv * map_model._K * car_model.M;
            if(world.cars[i].zv > 0)
                zf = -zf;
            var xa = (xf + _F * -Math.sin(world.cars[i].d)) / car_model.M;
            var za = (zf + _F * Math.cos(world.cars[i].d)) / car_model.M;
            world.cars[i].xv += xa * time;
            world.cars[i].zv += za * time;
            //转向
            if(players[i].key.onlyleft && players[i].key.onlyup || players[i].key.onlyright && players[i].key.onlydown) {
                world.cars[i].d = (world.cars[i].d + car_model.DV) % (Math.PI * 2);
                world.cars[i].da = 1;
            } else if(players[i].key.onlyright && players[i].key.onlyup || players[i].key.onlyleft && players[i].key.onlydown) {
                world.cars[i].d = (world.cars[i].d + Math.PI * 2 - car_model.DV) % (Math.PI * 2);
                world.cars[i].da = -1;
            } else {
                var _vd = Math.sin(world.cars[i].d) * world.cars[i].xv + Math.cos(world.cars[i].d) * world.cars[i].zv
                if(players[i].key.onlyleft && _vd > 0 || players[i].key.onlyright && _vd < 0) {
                    world.cars[i].d = (world.cars[i].d + car_model.DV) % (Math.PI * 2);
                    world.cars[i].da = 1;
                } else if(players[i].key.onlyright && _vd > 0 || players[i].key.onlyleft && _vd < 0) {
                    world.cars[i].d = (world.cars[i].d + Math.PI * 2 - car_model.DV) % (Math.PI * 2);
                    world.cars[i].da = -1;
                } else {
                    world.cars[i].da = 0;
                }
            }
        }
        //微速度停止处理
        _V = -Math.sin(world.cars[i].d) * world.cars[i].xv + Math.cos(world.cars[i].d) * world.cars[i].zv;
        _XV = -Math.sin(world.cars[i].d) * _V;
        _ZV = Math.cos(world.cars[i].d) * _V;
        _xv = world.cars[i].xv - _XV;
        _zv = world.cars[i].zv - _ZV;
        if(Math.abs(_xv) < map_model.min_v)
            world.cars[i].xv = _XV;
        if(Math.abs(_zv) < map_model.min_v)
            world.cars[i].zv = _ZV;
        if(Math.abs(world.cars[i].xv) < map_model.min_V)
            world.cars[i].xv = 0;
        if(Math.abs(world.cars[i].zv) < map_model.min_V)
            world.cars[i].zv = 0;
        //运动
        world.cars[i].px = world.cars[i].x;
        world.cars[i].pz = world.cars[i].z;
        world.cars[i].x += world.cars[i].xv * time;
        world.cars[i].z += world.cars[i].zv * time;
    }
    
    //CD
    for(var i = 0; i < players.length; i++) {
        players[i].cd -= time * 100;
        if(players[i].cd < 0)
            players[i].cd = 0;
    }
    for(var i = 0; i < world.boxes.length; i++) {
        world.boxes[i].cd -= time * 100;
        if(world.boxes[i].cd < 0)
            world.boxes[i].cd = 0;
    }
    for(var i = 0; i < world.traps.length; i++) {
        world.traps[i].cd -= time * 100;
        if(world.traps[i].cd < 0) {
            players[world.traps[i].player].items[world.traps[i].index] = 0;
            world.traps.splice(i, 1);
            i--;
        }
    }
    
    //释放道具
    for(var i = 0; i < players.length; i++) {
        if(players[i].cd == 0) {
            for(var j = 0; j < 4; j++) {
                if(players[i].key.item(j)) {
                    switch(players[i].items[j]) {
                        case 1:
                            //导弹
                            players[i].items[j] = 0;
                            players[i].cd = 5000;
                            world.missiles.push({
                                px: world.cars[i].x,
                                pz: world.cars[i].z,
                                x: world.cars[i].x,
                                z: world.cars[i].z,
                                d: world.cars[i].d,
                                xv: 200 * -Math.sin(world.cars[i].d),
                                zv: 200 * Math.cos(world.cars[i].d),
                                player: i
                            });
                            break;
                        case 2:
                            //炸弹
                            players[i].items[j] = 3;
                            players[i].cd = 5000;
                            world.traps.push({
                                x: world.cars[i].x,
                                z: world.cars[i].z,
                                d: world.cars[i].d,
                                player: i,
                                index: j,
                                cd: 20000
                            });
                            break;
                    }
                }
            }
        }
    }
    
    //碰撞
    //导弹-墙
    for(var j = 0; j < world.missiles.length; j++) {
        if(map_model.check(world.missiles[j])) {
            world.missiles.splice(j, 1);
            j--;
        }
    }
    for(var i = 0; i < players.length; i++) {
        //车-墙
        map_model.adjust(world.cars[i]);
        //车-盒子
        for(var j = 0; j < world.boxes.length; j++) {
            if(world.boxes[j].cd == 0 && hit(world.cars[i], world.boxes[j], 70) && players[i].hp > 0) {
                var k = 0;
                for(k = 0; k < 4; k++)
                    if(players[i].items[k] == 0)
                        break;
                if(k < 4) {
                    world.boxes[j].cd = 10000;
                    players[i].items[k] = Math.floor(Math.random() * 2 + 1);
                }
            }
        }
        if(players[i].hp > 0) {
            //车-炸弹
            for(var j = 0; j < world.traps.length; j++) {
                world.traps[j].cd -= time;
                if(world.traps[j].cd <= 0) {
                    players[world.traps[j].player].items[world.traps[j].index] = 0;
                    world.traps.splice(j, 1);
                    j--;
                } else if(world.traps[j].player != i && hit(world.cars[i], world.traps[j], 70)) {
                    players[i].hp--;
                    world.cars[i].xv /= 2;
                    world.cars[i].zv /= 2;
                    players[world.traps[j].player].items[world.traps[j].index] = 0;
                    world.traps.splice(j, 1);
                    j--;
                }
            }
        }
        //车-导弹
        for(var j = 0; j < world.missiles.length; j++) {
            if(world.missiles[j].player != i && hit(world.cars[i], world.missiles[j], 70)) {
                if(players[i].hp > 0) {
                    players[i].hp--;
                }
                world.cars[i].xv /= 2;
                world.cars[i].zv /= 2;
                world.missiles.splice(j, 1);
                j--;
            }
        }
    }
    
    //游戏结束判断
    var alivecount = 0;
    for(var i = 0; i < players.length; i++) {
        if(players[i].hp > 0)
            alivecount++;
    }
    if(alivecount <= 1 || current_time - this.start_time >= 300000) {
        this.ended = 1;
    }
    
    //生成msg
    for(var i = 0; i < world.boxes.length; i++) {
        this.msg.wld.bxs[i].d = Math.floor(world.boxes[i].d * 180 / Math.PI);
        this.msg.wld.bxs[i].v = world.boxes[i].cd == 0 ? 1 : 0;
    }
    for(var i = 0; i < players.length; i++) {
        this.msg.pls[i].hp = players[i].hp;
        this.msg.wld.crs[i].x = Math.floor(world.cars[i].x);
        this.msg.wld.crs[i].z = Math.floor(world.cars[i].z);
        this.msg.wld.crs[i].d = Math.floor(world.cars[i].d * 180 / Math.PI);
        this.msg.wld.crs[i].da = world.cars[i].da;
        this.msg.wld.crs[i].tp = world.cars[i].type;
    }
    this.msg.wld.mss = [];
    for(var i = 0; i < world.missiles.length; i++) {
        this.msg.wld.mss.push({
            x: Math.floor(world.missiles[i].x),
            z: Math.floor(world.missiles[i].z),
            d: Math.floor(world.missiles[i].d * 180 / Math.PI)
        });
    }
    this.msg.wld.tps = [];
    for(var i = 0; i < world.traps.length; i++) {
        this.msg.wld.tps.push({
            x: Math.floor(world.traps[i].x),
            z: Math.floor(world.traps[i].z),
            d: Math.floor(world.traps[i].d * 180 / Math.PI)
        });
    }
    this.msg.lst = Math.floor((current_time - this.start_time) / 1000);
    this.msg.end = this.ended;
    
    //标记时间
    world.sign_time = current_time;
}



Game.prototype.gen_msg = function (index) {
    var res = this.msg;
    res.idx = index;
    res.v = Math.floor(-Math.sin(this.world.cars[index].d) * this.world.cars[index].xv + Math.cos(this.world.cars[index].d) * this.world.cars[index].zv);
    res.its = this.players[index].items;
    res.cd = Math.floor(this.players[index].cd);
    for(var i = 0; i < this.world.traps.length; i++) {
        this.msg.wld.tps[i].v = this.world.traps[i].player == index ? 0 : 1;
    }
    return res;
}

Game.prototype.quit_player = function (room_player) {
    var index = this.room.players.indexOf(room_player);
    var player = this.players[index];
    this.players.splice(index, 1);
    this.msg.pls.splice(index, 1);
    this.world.cars.splice(index, 1);
    this.msg.wld.crs.splice(index, 1);
    for(var i = 0; i < this.world.traps.length; i++) {
        if(this.world.traps[i].player == index) {
            this.world.traps.splice(i, 1);
            i--;
        } else if(this.world.traps[i].player > index) {
            this.world.traps[i].player--;
        }
    }
    for(var i = 0; i < this.world.missiles.length; i++) {
        if(this.world.missiles[i].player == index) {
            this.world.missiles.splice(i, 1);
            i--;
        } else if(this.world.missiles[i].player > index) {
            this.world.missiles[i].player--;
        }
    }
}