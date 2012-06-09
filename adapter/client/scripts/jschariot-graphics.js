(function ($, window) {

var _color = function (r, g, b, a) {
    return new _color.prototype.init(r, g, b, a);
}
_color._hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
_color.prototype = {
    toString: function (style) {
        switch(style) {
            default:
            case 'rgba':
                return ['rgba(', Math.floor(this.red), ',', Math.floor(this.green), ',', Math.floor(this.blue), ',', this.alpha.toFixed(2), ')'].join('');
            case 'rgb':
                return ['rgba(', Math.floor(this.red), ',', Math.floor(this.green), ',', Math.floor(this.blue), ')'].join('');
            case 'hex':
                var res = ['#'];
                res.push(_color._hex[Math.floor(this.red / 16)] + _color._hex[Math.floor(this.red % 16)]);
                res.push(_color._hex[Math.floor(this.green / 16)] + _color._hex[Math.floor(this.green % 16)]);
                res.push(_color._hex[Math.floor(this.blue / 16)] + _color._hex[Math.floor(this.blue % 16)]);
                return res.join('');
            case 'hexwithalpha':
                var res = ['#'];
                res.push(_color._hex[Math.floor(this.red / 16)] + _color._hex[Math.floor(this.red % 16)]);
                res.push(_color._hex[Math.floor(this.green / 16)] + _color._hex[Math.floor(this.green % 16)]);
                res.push(_color._hex[Math.floor(this.blue / 16)] + _color._hex[Math.floor(this.blue % 16)]);
                res.push(_color._hex[Math.floor(this.alpha * 255 / 16)] + _color._hex[Math.floor(this.alpha * 255 % 16)]);
                return res.join('');
        }
    },
    mask: function (r, g, b, a) {
        var ncolor = null;
        if(r instanceof _color) {
            ncolor = r;
        } else {
            ncolor = _color(r, g, b, a);
        }
        var res = _color(this.red, this.green, this.blue, this.alpha);
        res.red = res.red * (1 - ncolor.alpha) + ncolor.red * ncolor.alpha;
        res.green = res.green * (1 - ncolor.alpha) + ncolor.green * ncolor.alpha;
        res.blue = res.blue * (1 - ncolor.alpha) + ncolor.blue * ncolor.alpha;
        return res;
    },
    init: function (r, g, b, a) {
        this.alpha = -1;
        if($.type(r) == 'string') {
            r = r.toLowerCase();
            if(r.charAt(0) == '#') {
                if(r.length == 4) {
                    var _r = _color._hex.indexOf(r.charAt(1));
                    this.red = _r * 16 + _r;
                    var _g = _color._hex.indexOf(r.charAt(2));
                    this.green = _g * 16 + _g;
                    var _b = _color._hex.indexOf(r.charAt(3));
                    this.blue = _b * 16 + _b;
                } else {
                    var _r1 = _color._hex.indexOf(r.charAt(1));
                    var _r2 = _color._hex.indexOf(r.charAt(2));
                    this.red = _r1 * 16 + _r2;
                    var _g1 = _color._hex.indexOf(r.charAt(3));
                    var _g2 = _color._hex.indexOf(r.charAt(4));
                    this.green = _g1 * 16 + _g2;
                    var _b1 = _color._hex.indexOf(r.charAt(5));
                    var _b2 = _color._hex.indexOf(r.charAt(6));
                    this.blue = _b1 * 16 + _b2;
                    if(r.length >= 9) {
                        var _a1 = _color._hex.indexOf(r.charAt(7));
                        var _a2 = _color._hex.indexOf(r.charAt(8));
                        this.alpha = (_a1 * 16 + _a2) / 255;
                    }
                }
            } else {
                switch(r) {
                    case 'red':
                        this.red = 255;
                        this.green = 0;
                        this.blue = 0;
                        break;
                    case 'green':
                        this.red = 0;
                        this.green = 255;
                        this.blue = 0;
                        break;
                    case 'blue':
                        this.red = 0;
                        this.green = 0;
                        this.blue = 255;
                        break;
                    case 'yellow':
                        this.red = 255;
                        this.green = 255;
                        this.blue = 0;
                        break;
                    case 'orange':
                        this.red = 255;
                        this.green = 165;
                        this.blue = 0;
                        break;
                    case 'pink':
                        this.red = 255;
                        this.green = 192;
                        this.blue = 203;
                        break;
                    case 'purple':
                        this.red = 128;
                        this.green = 0;
                        this.blue = 128;
                        break;
                    case 'black':
                        this.red = 0;
                        this.green = 0;
                        this.blue = 0;
                        break;
                    case 'gray':
                        this.red = 128;
                        this.green = 128;
                        this.blue = 128;
                        break;
                    case 'darkgray':
                        this.red = 169;
                        this.green = 169;
                        this.blue = 169;
                        break;
                    case 'lightgray':
                        this.red = 211;
                        this.green = 211;
                        this.blue = 211;
                        break;
                    case 'white':
                        this.red = 255;
                        this.green = 255;
                        this.blue = 255;
                        break;
                }
            }
            if(this.alpha == -1) {
                if($.type(g) == 'number') {
                    this.alpha = g;
                } else {
                    this.alpha = 1;
                }
            }
        } else if($.type(r) == $.type(g) == $.type(b) == $.type(a) == 'number') {
            this.red = r;
            this.green = g;
            this.blue = b;
            this.alpha = a;
        } else {
            this.red = 255;
            this.green = 255;
            this.blue = 255;
            this.alpha = 1;
        }
    }
};
_color.prototype.init.prototype = _color.prototype;

var _plane = function (width, height) {
    return [[
        {x: -width / 2, y: -height / 2, z: 0},
        {x: width / 2, y: -height / 2, z: 0},
        {x: width / 2, y: height / 2, z: 0},
        {x: -width / 2, y: height / 2, z: 0}
    ]];
}
var _box = function (width1, width2, height) {
    return [
        [
            {x: -width1 / 2, y: height / 2, z: width2 / 2},
            {x: width1 / 2, y: height / 2, z: width2 / 2},
            {x: width1 / 2, y: -height / 2, z: width2 / 2},
            {x: -width1 / 2, y: -height / 2, z: width2 / 2}
        ],
        [
            {x: -width1 / 2, y: -height / 2, z: -width2 / 2},
            {x: width1 / 2, y: -height / 2, z: -width2 / 2},
            {x: width1 / 2, y: height / 2, z: -width2 / 2},
            {x: -width1 / 2, y: height / 2, z: -width2 / 2}
        ],
        [
            {x: width1 / 2, y: height / 2, z: width2 / 2},
            {x: width1 / 2, y: height / 2, z: -width2 / 2},
            {x: width1 / 2, y: -height / 2, z: -width2 / 2},
            {x: width1 / 2, y: -height / 2, z: width2 / 2}
        ],
        [
            {x: -width1 / 2, y: -height / 2, z: width2 / 2},
            {x: -width1 / 2, y: -height / 2, z: -width2 / 2},
            {x: -width1 / 2, y: height / 2, z: -width2 / 2},
            {x: -width1 / 2, y: height / 2, z: width2 / 2}
        ],
        [
            {x: -width1 / 2, y: height / 2, z: -width2 / 2},
            {x: width1 / 2, y: height / 2, z: -width2 / 2},
            {x: width1 / 2, y: height / 2, z: width2 / 2},
            {x: -width1 / 2, y: height / 2, z: width2 / 2}
        ],
        [
            {x: -width1 / 2, y: -height / 2, z: width2 / 2},
            {x: width1 / 2, y: -height / 2, z: width2 / 2},
            {x: width1 / 2, y: -height / 2, z: -width2 / 2},
            {x: -width1 / 2, y: -height / 2, z: -width2 / 2}
        ]
    ];
}
var _cylinder = function (height, radius, scount) {
    scount = scount || 10;
    var top = [];
    var bottom = [];
    var res = [];
    for(var i = 0; i < scount; i++) {
        var _c = Math.PI * 2 / scount * i;
        var _x = Math.cos(_c) * radius;
        var _z = Math.sin(_c) * radius;
        top.push({x: _x, y: -height / 2, z: _z});
        bottom.push({x: _x, y: height / 2, z: _z});
        if(i > 0) {
            res.push([
                {x: top[i - 1].x, y: -height / 2, z: top[i - 1].z},
                {x: _x, y: -height / 2, z: _z},
                {x: _x, y: height / 2, z: _z},
                {x: top[i - 1].x, y: height / 2, z: top[i - 1].z}
            ]);
        }
    }
    res.push([
        {x: top[scount - 1].x, y: -height / 2, z: top[scount - 1].z},
        {x: top[0].x, y: -height / 2, z: top[0].z},
        {x: top[0].x, y: height / 2, z: top[0].z},
        {x: top[scount - 1].x, y: height / 2, z: top[scount - 1].z}
    ]);
    res.push(top.reverse());
    res.push(bottom);
    return res;
}
var _cone = function (height, radius, scount) {
    scount = scount || 10;
    var bottom = [];
    var res = [];
    for(var i = 0; i < scount; i++) {
        var _c = Math.PI * 2 / scount * i;
        var _x = Math.cos(_c) * radius;
        var _z = Math.sin(_c) * radius;
        bottom.push({x: _x, y: height / 2, z: _z});
        if(i > 0) {
            res.push([
                {x: 0, y: -height / 2, z: 0},
                {x: _x, y: height / 2, z: _z},
                {x: bottom[i - 1].x, y: height / 2, z: bottom[i - 1].z}
            ]);
        }
    }
    res.push([
        {x: 0, y: -height / 2, z: 0},
        {x: bottom[0].x, y: height / 2, z: bottom[0].z},
        {x: bottom[scount - 1].x, y: height / 2, z: bottom[scount - 1].z}
    ]);
    res.push(bottom);
    return res;
}
var _yaw = function(item, degree) {
    degree = degree / 180 * Math.PI;
    $.array_each(item, function () {
        $.array_each(this, function () {
            var _x = Math.cos(degree) * this.x - Math.sin(degree) * this.z;
            var _z = Math.sin(degree) * this.x + Math.cos(degree) * this.z;
            this.x = _x;
            this.z = _z;
        });
    });
}
var _pitch = function(item, degree) {
    degree = degree / 180 * Math.PI;
    $.array_each(item, function () {
        $.array_each(this, function () {
            var _y = Math.cos(degree) * this.y - Math.sin(degree) * this.z;
            var _z = Math.sin(degree) * this.y + Math.cos(degree) * this.z;
            this.y = _y;
            this.z = _z;
        });
    });
}
var _roll = function(item, degree) {
    degree = degree / 180 * Math.PI;
    $.array_each(item, function () {
        $.array_each(this, function () {
            var _x = Math.cos(degree) * this.x - Math.sin(degree) * this.y;
            var _y = Math.sin(degree) * this.x + Math.cos(degree) * this.y;
            this.x = _x;
            this.y = _y;
        });
    });
}
var _da_yaw = function (item, da, degree) {
    degree = degree || 20;
    if(da > 0) {
        _yaw(item, degree);
    } else if(da < 0) {
        _yaw(item, -degree);
    }
}
var _move = function (item, x, y, z) {
    $.array_each(item, function () {
        $.array_each(this, function () {
            this.x += x;
            this.y += y;
            this.z += z;
        });
    });
}

var _car_cache = {};
var _get_car = function (tp) {
    if(_car_cache[tp] != null) {
        if(_car_cache[tp].loaded) {
            return _car_cache[tp];
        }
    } else {
        _car_cache[tp] = {
            loaded: false
        };        
        $.getScript('scripts/models/cars/' + tp + '.js');
        return null;
    }
}
var _map_cache = {};
var _get_map = function (map) {
    if(_map_cache[map] != null) {
        if(_map_cache[map].loaded) {
            return _map_cache[map];
        }
    } else {
        _map_cache[map] = {
            loaded: false
        };
        $.getScript('scripts/models/maps/' + map + '.js');
        return null;
    }
}

var _camera = function (vport, position) {
    var _cam = $.data(vport, '_camera');
    if(_cam != null) {
        _cam.vport_height = vport.height();
        _cam.vport_width = vport.width();
        _cam.position = {
            x: position.x, y: -200, z: position.z, d: position.d
        };
    } else {
        _cam = {
            graphics: vport.get(0).getContext('2d'),
            vport_height: vport.height(),
            vport_width: vport.width(),
            position: {
                x: position.x, y: -200, z: position.z, d: position.d
            },
            focal_length: 500,
            disappear_length: 10,
            drawpolygon: function (transformed_points, fill_color, stroke_color) {
                fill_color = fill_color || transformed_points.color || '#fff';
                stroke_color = stroke_color || '#000';
                if(fill_color instanceof _color) {
                    fill_color = fill_color.toString();
                }
                if(stroke_color instanceof _color) {
                    stroke_color = stroke_color.toString();
                }
                this.graphics.strokeStyle = stroke_color;
                this.graphics.fillStyle = fill_color;
                this.graphics.beginPath();
                var lp = transformed_points[transformed_points.length - 1];
                this.graphics.moveTo(lp.x, lp.y);
                for(var i = 0; i < transformed_points.length; i++) {
                    this.graphics.lineTo(transformed_points[i].x, transformed_points[i].y);
                }
                this.graphics.stroke();
                this.graphics.fill();
                this.graphics.closePath();
            },
            drawunit: function (transformed_points) {
                var visible = true;
                if(transformed_points.length > 2) {
                    var p1 = transformed_points[0];
                    var p2 = transformed_points[1];
                    var p3 = transformed_points[2];
                    if(p1.x == p2.x)
                        visible = (p1.y < p2.y) == (p1.x > p3.x);
                    else if(p1.x == p3.x)
                        visible = (p1.y < p3.y) == (p1.x < p2.x);
                    else
                        visible = ((p1.y - p2.y) / (p1.x - p2.x) < (p1.y - p3.y) / (p1.x - p3.x)) ^ ((p1.x <= p2.x) == (p1.x > p3.x));
                } else {
                    return;
                }
                if(visible) {
                    this.drawpolygon(transformed_points);
                }
            },
            transform_point: function (p) {
                var rate = this.focal_length / (this.focal_length + p.z);
                return {x: p.x * rate + this.vport_width / 2, y: p.y * rate + this.vport_height / 2, z: p.z};
            },
            transform: function (points, render_shadow) {
                if(points.length == 0)
                    return points;
                var res = [];
                var near = [], far = [];
                for(var i = 0; i < points.length; i++) {
                    res.push(this.transform_point(points[i]));
                    if(near.length == 0) {
                        near.push(res[i]);
                    } else if(res[i].z == near[0].z) {
                        near.push(res[i]);
                    } else if(res[i].z < near[0].z) {
                        near = [res[i]];
                    }
                    if(far.length == 0) {
                        far.push(res[i]);
                    } else if(res[i].z == far[0].z) {
                        far.push(res[i]);
                    } else if(res[i].z > far[0].z) {
                        far = [res[i]];
                    }
                }
                res.color = points.color || _color('white');
                
                //Shadow
                if(render_shadow) {
                    var nearx = 0, neary = 0, farx = 0, fary = 0;
                    for(var i = 0; i < near.length; i++) {
                        nearx += near[i].x;
                        neary += near[i].y;
                    }
                    nearx /= near.length;
                    neary /= near.length;
                    for(var i = 0; i < far.length; i++) {
                        farx += far[i].x;
                        fary += far[i].y;
                    }
                    farx /= far.length;
                    fary /= far.length;
                    var nearz = near[0].z, farz = far[0].z;
                    var fill_color = this.graphics.createLinearGradient(nearx, neary, farx, fary);
                    //$.log(res.color.mask('white', 0.2).toString(), res.color.toString(), res.color.mask('black', 0.2).toString());
                    //$.log(nearx, neary, farx, fary);
                    fill_color.addColorStop(0, res.color.mask('white', 0.05).toString());
                    fill_color.addColorStop(0.5, res.color.toString());
                    fill_color.addColorStop(1, res.color.mask('black', 0.05).toString());
                    res.color = fill_color;
                }
                
                return res;
            },
            adjust_point: function (p) {
                var item = [[p]];
                _move(item, -this.position.x, -this.position.y, -this.position.z);
                _yaw(item, -this.position.d);
                return p;
            },
            adjust: function (items) {
                var cam = this;
                $.each(items, function () {
                    var item = this;
                    var zindex = 0;
                    var pcount = 0;
                    _move(item, -cam.position.x, -cam.position.y, -cam.position.z);
                    _yaw(item, -cam.position.d);
                    for(var ki = 0; ki < item.length; ki++) {
                        var res = [];
                        var flag = false;
                        var shape = item[ki];
                        if (shape[shape.length - 1].z + cam.focal_length < 0)
                            flag = true;
                        for (var i = 0; i < shape.length; i++)
                        {
                            if (shape[i].z + cam.focal_length < 0)
                            {
                                if (!flag)
                                {
                                    var prev = shape[(i + shape.length - 1) % shape.length];
                                    var x = prev.x + (shape[i].x - prev.x) / (prev.z - shape[i].z) * (prev.z + cam.focal_length - cam.disappear_length);
                                    var y = prev.y + (shape[i].y - prev.y) / (prev.z - shape[i].z) * (prev.z + cam.focal_length - cam.disappear_length);
                                    res.push({x: x, y: y, z: -cam.focal_length + cam.disappear_length});
                                    flag = true;
                                }
                            }
                            else
                            {
                                if (flag)
                                {
                                    var prev = shape[(i + shape.length - 1) % shape.length];
                                    var x = shape[i].x + (prev.x - shape[i].x) / (shape[i].z - prev.z) * (shape[i].z + cam.focal_length - cam.disappear_length);
                                    var y = shape[i].y + (prev.y - shape[i].y) / (shape[i].z - prev.z) * (shape[i].z + cam.focal_length - cam.disappear_length);
                                    res.push({x: x, y: y, z: -cam.focal_length + cam.disappear_length});
                                    flag = false;
                                }
                                res.push(shape[i]);
                            }
                        }
                        res.color = item[ki].color;
                        item[ki] = res;
                        for(var i = 0; i < shape.length; i++) {
                            zindex += shape[i].z;
                            pcount++;
                        }
                    }
                    item.zindex = zindex / pcount;
                });
                items.sort(function (a, b) {
                    return b.zindex - a.zindex;
                });
                return items;
            }
        };
        $.data(vport, '_camera', _cam);
    }
    return _cam;
}

var _scene = function (data, map) {
    var _items = [];
    $.each(data.crs, function () {
        var car = _get_car(this.tp);
        if(car != null) {
            _items.push(car.gen_car(this));
        }
    });
    if(map != null) {
        $.each(data.bxs, function () {
            if(this.v) {
                _items.push(map.gen_box(this));
            }
        });
        $.each(data.tps, function () {
            _items.push(map.gen_trap(this));
        });
        $.each(data.mss, function () {
            _items.push(map.gen_missile(this));
        });
    }
    return _items;
}

window.jschariot_graphics = {
    color: _color,
    plane: _plane,
    box: _box,
    cylinder: _cylinder,
    cone: _cone,
    pitch: _pitch,
    roll: _roll,
    yaw: _yaw,
    da_yaw: _da_yaw,
    move: _move,
    set_car_model: function (tp, data) {
        _car_cache[tp] = data;
        _car_cache[tp].loaded = true;
    },
    set_map_model: function (map, data) {
        _map_cache[map] = data;
        _map_cache[map].loaded = true;
    },
    draw: function (target, data, _rinfo, options) {
        var cam = _camera(target, data.wld.crs[data.idx]);
        var map = _get_map(data.map);
        
        //scene
        if(map != null) {
            map.draw_background(cam);
            $.each(cam.adjust(map.gen_wall()), function () {
                $.array_each(this, function () {
                    cam.drawunit(cam.transform(this, options.render_shadow));
                });
            });
        }
        var _items = _scene(data.wld, map);
        _items = cam.adjust(_items);
        var _shapes = [];
        $.each(_items, function () {
            var item = this;
            $.array_each(item, function () {
                this.color = this.color || item.color;
                _shapes.push(this);
            });
        });
        $.each(_shapes, function () {
            cam.drawunit(cam.transform(this, options.render_shadow));
        });
        
        //map, status
        if(map != null) {
            for(var i = 0; i < data.wld.crs.length; i++) {
                if(i != data.idx) {
                    var p = cam.adjust_point({
                        x: data.wld.crs[i].x,
                        y: -200,
                        z: data.wld.crs[i].z
                    });
                    if(p.z + cam.focal_length - cam.disappear_length >= 0) {
                        map.draw_others_status(cam, {
                            hp: data.pls[i].hp,
                            name: _rinfo.players[i].name,
                            ip: _rinfo.players[i].ip
                        }, cam.transform_point(p));
                    }
                }
            }
            map.draw_status(cam, data);
        } else {
            cam.graphics.fillStyle = '#fff';
            cam.graphics.fillRect(0, 0, cam.vport_width, cam.vport_height);
            cam.graphics.font = '20px 黑体';
            cam.graphics.fillStyle = '#000';
            var tip = "载入中...";
            cam.graphics.fillText(tip, cam.vport_width / 2 - cam.graphics.measureText(tip).width / 2, cam.vport_height / 2 - 24);
        }
    }
};

})(jQuery, window);
