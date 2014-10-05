var isy = require('./isy');
var pinger = require('./pinger');
var config = require('./devicelist.json');
var houseconfig = require('../houseconfig.json');

var isyConnection = new isy.ISY(houseconfig.isy.address, houseconfig.isy.username, houseconfig.isy.password);

function reportdeviceState(targetInfo, found) {
    if(targetInfo.isyVariableId == 0) {
        return;
    } else {
        var valueToSet = 0;
        if (found == true) {
            valueToSet = 1;
        }
        isyConnection.setVariable(targetInfo.isyVariableId, valueToSet);
    }
}

var pingService = new pinger.Pinger(config, reportdeviceState, 30000, 3, 1500);
pingService.start();
