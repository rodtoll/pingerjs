/**
 * Created by root on 9/21/14.
 */

var ping = require('net-ping');

var Pinger = function(targetlist, changeCallback, timeBetweenAttempts, attempts, attemptTimeout) {
    this.targets = targetlist;
    this.targetMap = new Object();
    this.changeCallback = changeCallback;
    this.timeBetweenAttempts = timeBetweenAttempts;
    this.attempts = attempts;
    this.attemptTimeout = attemptTimeout;
    for(var x = 0; x < this.targets.length; x++) {
        console.log('### Host: '+this.targets[x].address+' Name: '+this.targets[x].friendlyName);
        this.targetMap[this.targets[x].address] = this.targets[x];
    }
};

Pinger.prototype.handlePingResult = function(error,address) {

    var found = !error;
    var targetInfo = this.targetMap[address];

    if(found == true) {
        /* If no notification has been sent yet or it is currently not present -- and we found it
         then notify the callback function. */
        if(!targetInfo.hasOwnProperty('present') || targetInfo.present == false) {
            console.log('### Device found and not previously reported (or previously not found): '+address);
            this.changeCallback(targetInfo, found);
            targetInfo.present = true;
        } else {
        }

        targetInfo.lastSeen = new Date();
    } else {
        /* Never been seen or not seen */
        if(!targetInfo.hasOwnProperty('present')) {
            console.log('### Device not found and not previously reported: '+address);
            this.changeCallback(targetInfo, found);
            targetInfo.present = false;
        } else if(targetInfo.present == false) {
        } else {
            console.log('### Devide not found and is currently present: '+address)
            var currentDate = new Date();
            var dateDeltaInSeconds = (currentDate.getTime() - targetInfo.lastSeen.getTime()) / 1000;
            if (dateDeltaInSeconds > targetInfo.timeoutInterval) {
                console.log('### Timeout exceeded, reporting it missing. '+address);
                this.changeCallback(targetInfo, found);
                targetInfo.present = false;
            }
        }
    }

    var that = this;

    setTimeout(
        function(address, callback, timeout) { that.session.pingHost(address, callback, timeout) },
        this.timeBetweenAttempts,
        address,
        function(error, address) { that.handlePingResult(error,address) },
        this.attemptTimeout);
}

Pinger.prototype.start = function() {

    var options = {
        retries: this.attempts,
        timeout: this.attemptTimeout
    };

    this.session = ping.createSession(options);

    var that = this;

    for(var x = 0; x < this.targets.length; x++) {
        this.session.pingHost(
            this.targets[x].address,
            function(error, address) { that.handlePingResult(error,address) },
            this.attemptTimeout);
    }

}

exports.Pinger = Pinger;
