(function ($, jcg) {

jcg.set_car_model(0, {
    gen_car: function (data) {    
        var res = [];
        var wheel = jcg.cylinder(20, 15);
        jcg.roll(wheel, 90);
        jcg.da_yaw(wheel, data.da);
        jcg.move(wheel, -75, -15, 40);
        res = $.merge(res, wheel);
        
        wheel = jcg.cylinder(20, 15);
        jcg.roll(wheel, 90);
        jcg.da_yaw(wheel, data.da);
        jcg.move(wheel, 75, -15, 40);
        res = $.merge(res, wheel);
        
        wheel = jcg.cylinder(20, 15);
        jcg.roll(wheel, 90);
        jcg.da_yaw(wheel, data.da);
        jcg.move(wheel, -75, -15, -40);
        res = $.merge(res, wheel);
        
        wheel = jcg.cylinder(20, 15);
        jcg.roll(wheel, 90);
        jcg.da_yaw(wheel, data.da);
        jcg.move(wheel, 75, -15, -40);
        res = $.merge(res, wheel);
        
        var body = jcg.box(150, 200, 50);
        body[0][2].y += 15;
        body[0][3].y += 15;
        body[2][3].z -= 15;
        body[2].push({
            x: 75, y: -10, z: 100
        });
        body[3][0].z -= 15;
        body[3] = $.merge([{
            x: -75, y: -10, z: 100
        }], body[3]);
        body[5][0].z -= 15;
        body[5][1].z -= 15;
        body.push([
            {x: -75, y: -10, z: 100},
            {x: 75, y: -10, z: 100},
            {x: 75, y: -25, z: 85},
            {x: -75, y: -25, z: 85}
        ]);
        jcg.move(body, 0, -50, 0);
        res = $.merge(res, body);
        
        var head = jcg.box(100, 100, 50);
        head[0][2].y += 15;
        head[0][3].y += 15;
        head[2][3].z -= 15;
        head[2].push({
            x: 50, y: -10, z: 50
        });
        head[3][0].z -= 15;
        head[3] = $.merge([{
            x: -50, y: -10, z: 50
        }], head[3]);
        head[5][0].z -= 15;
        head[5][1].z -= 15;
        head.push([
            {x: -50, y: -10, z: 50},
            {x: 50, y: -10, z: 50},
            {x: 50, y: -25, z: 35},
            {x: -50, y: -25, z: 35}
        ]);
        jcg.move(head, 0, -100, -20);
        res = $.merge(res, head);
        
        jcg.da_yaw(res, data.da, 5);
        jcg.yaw(res, data.d);
        jcg.move(res, data.x, 0, data.z);
        return res;
    }
});

})(jQuery, jschariot_graphics);