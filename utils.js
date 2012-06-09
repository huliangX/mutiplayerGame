Array.prototype.remove = function (item) {
    var i = 0;
    for(i = 0; i < this.length; i++) {
        if(this[i] == item)
            break;
    }
    this.splice(i, 1);
}