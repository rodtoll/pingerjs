var isy = require('./isy');
var pinger = require('./pinger');
var config = require('./devicelist.json');

var isyConnection = new isy.ISY('10.0.1.19', 'admin', 'ErgoFlat91');

function reportdeviceState(targetInfo, found) {
    if(targetInfo.isyVariableId == 0) {
        console.log('<><> Target: '+targetInfo.address+' ('+targetInfo.friendlyName+') State: '+found+' NO ISY VAR');
        return
    } else {
        console.log('<><> Target: ' + targetInfo.address + ' (' + targetInfo.friendlyName + ') State: ' + found + ' Isy: ' + targetInfo.isyVariableId);
        var valueToSet = 0;
        if (found == true) {
            valueToSet = 1;
        }
        isyConnection.setVariable(targetInfo.isyVariableId, valueToSet);
    }
}

var pingService = new pinger.Pinger(config, reportdeviceState, 30000, 3, 1500);
pingService.start();
