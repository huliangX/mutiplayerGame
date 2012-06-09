var Config = require('./config'),
    network_list = [];

for(var i = 0; i < Config.networks.length; i++) {
    var network = require(Config.networks[i].module);
    network.start(Config.networks[i]);
    console.log("start network");
    network_list.push(network);
}

var Network = {
    on: function (name, func) {
        for(var i = 0; i < network_list.length; i++) {
            network_list[i].on(name, func);
        }
    },
    emit: function (name, data) {
        for(var i = 0; i < network_list.length; i++) {
            network_list[i].emit(name, data);
        }
    }
};

exports = module.exports = Network;