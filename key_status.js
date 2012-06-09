var EventEmitter = process.EventEmitter;

function KeyStatus()
{
    var new_key_status = {
        __status: 0
    };
    new_key_status.__proto__ = KeyStatus.prototype;
    return new_key_status;
}

KeyStatus.prototype.__defineGetter__("status", function () {
    return this.__status;
});

KeyStatus.prototype.__defineSetter__("status", function (value) {
    if(typeof value == "string") {
        var __value = parseInt(value, 16);
        if(!isNaN(__value)) {
            this.__status = __value % 256;
        }
    } else if(typeof value == "number") {
        this.__status = Math.floor(value % 256);
    }
});
KeyStatus.prototype.get = function (num) {
    return (this.__status & num) != 0;
}
KeyStatus.prototype.set = function (num, value) {
    if(value) {
        this.__status = this.__status | num;
    } else {
        this.__status = this.__status & (num - 1);
    }
}
KeyStatus.prototype.__defineGetter__("up", function () {
    return this.get(128);
});
KeyStatus.prototype.__defineGetter__("onlyup", function () {
    return this.get(128) && !this.get(64);
});
KeyStatus.prototype.__defineSetter__("up", function (value) {
    this.set(128, value);
});
KeyStatus.prototype.__defineGetter__("down", function () {
    return this.get(64);
});
KeyStatus.prototype.__defineGetter__("onlydown", function () {
    return this.get(64) && !this.get(128);
});
KeyStatus.prototype.__defineSetter__("down", function (value) {
    this.set(64, value);
});
KeyStatus.prototype.__defineGetter__("left", function () {
    return this.get(32);
});
KeyStatus.prototype.__defineGetter__("onlyleft", function () {
    return this.get(32) && !this.get(16);
});
KeyStatus.prototype.__defineSetter__("left", function (value) {
    this.set(32, value);
});
KeyStatus.prototype.__defineGetter__("right", function () {
    return this.get(16);
});
KeyStatus.prototype.__defineGetter__("onlyright", function () {
    return this.get(16) && !this.get(32);
});
KeyStatus.prototype.__defineSetter__("right", function (value) {
    this.set(16, value);
});

//道具
KeyStatus.prototype.item = function (index, value) {
    if(value != null) {
        this.set([8, 4, 2, 1][index], value);
    } else {
        return this.get([8, 4, 2, 1][index]);
    }
}

exports = module.exports = KeyStatus;
