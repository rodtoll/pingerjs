/**
 * Created by root on 9/21/14.
 */

var restler = require('restler');

var ISY = function(address, username, password) {
    this.address  = address;
    this.username = username;
    this.password = password;
};

ISY.prototype.setVariable = function(variableId, valueToSet) {

    var options = {
        username: this.username,
        password: this.password
    };

    restler.get(
        'http://'+this.address+'/rest/vars/set/2/' + variableId + '/' + valueToSet,
        options
    ).on('complete', function(result) {
            if (result instanceof Error) {
                console.log('Error:'+result.message);
            } else {
                console.log('ISY Success: '+result);
            }
        });
}

exports.ISY = ISY;

