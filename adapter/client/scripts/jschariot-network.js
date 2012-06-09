(function ($, window) {
    var socket = io.connect();
    socket.on("disconnect", function () {
        $.confirm({
            tip: "与服务器连接断开，点击确定或取消刷新。",
            okfunc: function () {
                location = location.href;
            },
            cancelfunc: function () {
                location = location.href;
            }
        });
    });
    window.jschariot_network = {
        socket: socket,
        request: function (tip, method, data, success) {
            if(tip != null)
                $.waiting(tip + "...");
            socket.emit(method, data);
            if(success) {
                var reply_delegate = function (_data) {
                    socket.removeListener("reply_" + method, reply_delegate);
                    if(_data.suc) {
                        success(_data.data);
                    } else {
                        if(_data.data != null)
                            $.confirm(_data.data + '失败，请稍后重试。');
                    }
                };
                socket.on("reply_" + method, reply_delegate);
            }
        }
    };
})(jQuery, window);