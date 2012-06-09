/* 
network 
*/ 

var express = require('express'),
    app = express.createServer(),
    io = require('socket.io').listen(app),
    socket = require('socket.io').Socket;

io.set('log level', 1);  // debug off


socket.prototype.__defineGetter__("remoteAddress", function () {
    return this.handshake.address;
});

var adapter_web = {
    on: function (name, func) {
        io.sockets.on(name, func);
    },
    emit: function (name, data) {
        //console.log("adapter_web emit");
        //console.log(data);        
        io.sockets.emit(name, data);
    },
    start: function (options) {
        app.listen(options.port);
    console.log("listen"+options.port);
        app.get('/', function (req, res) {
            res.sendfile(__dirname + '/client/demo.html');
        });
        app.configure(function () {
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.static(__dirname + '/client'));  // 这样才能确保整个文件夹被传过去
        });
    }
};

exports = module.exports = adapter_web;
