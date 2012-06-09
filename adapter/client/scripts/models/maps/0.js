(function ($, jcg) {

var _items_cache = [];
for(var i = 0; i < 4; i++) {
    var _img = new Image();
    _img.src = 'images/styles/0/items/' + i + '.png';
    _items_cache.push(_img);
}

jcg.set_map_model(0, {
    gen_wall: function () {
        var res = [];
        var wall = jcg.plane(4300, 200);
        jcg.move(wall, 0, -100, 2150);
        res.push(wall);
        wall = jcg.plane(4300, 200);
        jcg.yaw(wall, 180);
        jcg.move(wall, 0, -100, -2150);
        res.push(wall);
        wall = jcg.plane(4300, 200);
        jcg.yaw(wall, -90);
        jcg.move(wall, 2150, -100, 0);
        res.push(wall);
        wall = jcg.plane(4300, 200);
        jcg.yaw(wall, 90);
        jcg.move(wall, -2150, -100, 0);
        res.push(wall);
        return res;
    },
    gen_trap: function (data) {
        var res = jcg.box(50, 50, 10);
        jcg.yaw(res, data.d);
        jcg.move(res, data.x, -5, data.z);
        if(data.v)
            res.color = jcg.color('#ddd');
        return res;
    },
    gen_missile: function (data) {
        var res = jcg.cone(50, 5);
        jcg.pitch(res, -90);
        jcg.yaw(res, data.d);
        jcg.move(res, data.x, -100, data.z);
        return res;
    },
    gen_box: function (data) {
        var res = jcg.box(50, 50, 50);
        jcg.yaw(res, data.d);
        jcg.move(res, data.x, -100, data.z);
        return res;
    },
    draw_background: function (cam) {
        cam.graphics.fillStyle = "#ddd";
        cam.graphics.fillRect(0, 0, cam.vport_width, cam.vport_height / 2);
        cam.graphics.fillStyle = "#eee";
        cam.graphics.fillRect(0, cam.vport_height / 2, cam.vport_width, cam.vport_height);
    },
    draw_others_status: function (cam, data, point) {
        cam.graphics.font = '10px Arial';
        cam.graphics.fillStyle = '#000';
        var hp = data.hp + ' / 3';
        cam.graphics.fillText(hp, point.x - cam.graphics.measureText(hp).width / 2, point.y - 24);
        var name = data.name;
        cam.graphics.fillText(name, point.x - cam.graphics.measureText(name).width / 2, point.y - 12);
        var ip = data.ip.address + ':' + data.ip.port;
        cam.graphics.fillText(ip, point.x - cam.graphics.measureText(ip).width / 2, point.y);
    },
    draw_status: function (cam, data, items, options) {
        
        //hp
        for(var i = 0; i < 3; i++) {
            cam.drawpolygon([
                {x: 820, y: 10 + i * 21},
                {x: 900, y: 10 + i * 21},
                {x: 900, y: 28 + i * 21},
                {x: 820, y: 28 + i * 21}
            ], data.pls[data.idx].hp >= 3 - i ? '#aaa' : '#fff');
        }
        
        //cd
        if(data.cd > 0) {
            cam.drawpolygon([
                {x: 800 - data.cd / 20, y: 60},
                {x: 800, y: 60},
                {x: 800, y: 70},
                {x: 800 - data.cd / 20, y: 70}
            ], '#eee');
        }
        
        //items
        for(var i = 0; i < 4; i++) {
            cam.drawpolygon([
                {x: 610 + i * 50, y: 10},
                {x: 650 + i * 50, y: 10},
                {x: 650 + i * 50, y: 50},
                {x: 610 + i * 50, y: 50}
            ]);
            cam.graphics.drawImage(_items_cache[data.its[i]], 610 + i * 50, 10);
        }
        
        //time
        cam.graphics.font = '20px Arial';
        cam.graphics.fillStyle = '#000';
        var timetip = Math.floor(data.lst / 60) + ':' + (data.lst % 60 < 10 ? '0' + data.lst % 60 : data.lst % 60);
        cam.graphics.fillText(timetip, 460 - cam.graphics.measureText(timetip).width / 2, 30);
    
        //game_status
        if(data.end) {
            var gametip = '';
            if(data.lst == 300) {
                gametip = '游戏结束';
            } else if(data.pls[data.idx].hp == 0) {
                gametip = '失败！';
            } else {
                gametip = '胜利！';
            }
            cam.drawpolygon([
                {x: 460 - cam.graphics.measureText(gametip).width / 2 - 30, y: 40},
                {x: 460 + cam.graphics.measureText(gametip).width / 2 + 30, y: 40},
                {x: 460 + cam.graphics.measureText(gametip).width / 2 + 30, y: 80},
                {x: 460 - cam.graphics.measureText(gametip).width / 2 - 30, y: 80}
            ]);
            if(data.pls[data.idx].hp == 0) {
                cam.graphics.fillStyle = '#448';
            } else {
                cam.graphics.fillStyle = '#844';
            }
            cam.graphics.font = '30px 黑体';
            cam.graphics.fillText(gametip, 460 - cam.graphics.measureText(gametip).width / 2, 70);
        } else if(data.pls[data.idx].hp == 0) {
            var gametip = '你阵亡了。';
            cam.drawpolygon([
                {x: 460 - cam.graphics.measureText(gametip).width / 2 - 30, y: 40},
                {x: 460 + cam.graphics.measureText(gametip).width / 2 + 30, y: 40},
                {x: 460 + cam.graphics.measureText(gametip).width / 2 + 30, y: 80},
                {x: 460 - cam.graphics.measureText(gametip).width / 2 - 30, y: 80}
            ]);
            cam.graphics.font = '30px 黑体';
            cam.graphics.fillStyle = '#448';
            cam.graphics.fillText(gametip, 460 - cam.graphics.measureText(gametip).width / 2, 70);
        }
        
        //map
        cam.drawpolygon([
            {x: 10, y: 10},
            {x: 210, y: 10},
            {x: 210, y: 210},
            {x: 10, y: 210}
        ]);
        $.each(data.wld.bxs, function () {
            if(this.v) {
                var _x = this.x;
                var _z = this.z;
                var signal = [[
                    {x: -2, y: -2, z: 0},
                    {x: 2, y: -2, z: 0},
                    {x: 2, y: 2, z: 0},
                    {x: -2, y: 2, z: 0}
                ]];
                jcg.roll(signal, -this.d);
                jcg.move(signal, 110 + _x / 20, 110 - _z / 20, 0);
                cam.drawpolygon(signal[0]);
            }
        });
        $.each(data.wld.crs, function (i, n) {
            var _x = this.x;
            var _z = this.z;
            var signal = [[
                {x: 0, y: -3, z: 0},
                {x: 2, y: 3, z: 0},
                {x: -2, y: 3, z: 0}
            ]];
            signal[0].color = jcg.color(i == data.idx ? '#aaa' : '#fff');
            jcg.roll(signal, -this.d);
            jcg.move(signal, 110 + _x / 20, 110 - _z / 20, 0);
            cam.drawpolygon(signal[0]);
        });
    }
});

})(jQuery, jschariot_graphics);