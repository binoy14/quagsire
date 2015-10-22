module.exports = function (num) {
    var hex = num.toString('hex');
    var cardDataHex = hex.split('');
    var regex = /([1-9][0-9]+)/;
    var rawId = cardDataHex.splice(234, 52);
    var stringId = '';
    rawId = rawId.join('');
    for (var i = 0; i < rawId.length; i += 2) {
        stringId += String.fromCharCode(parseInt(rawId.substr(i, 2), 16));
    }
    var finalId = stringId.match(regex);
    if(finalId){
        return finalId[0];
    }
    return false;
};
