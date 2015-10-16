module.exports = function (cardData) {
    var regex = /([1-9][0-9]+)/;
    var rawId = cardData.splice(234, 52);
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
