var device = require('./helpers/findDevice');
var getId = require('./helpers/getId');

if(device){
  device.on('data', function(info){
    var hex = info.toString('hex');
    var cardDataHex = hex.split('');
    var finalId = getId(cardDataHex);
    if (finalId != false) {
      console.log(finalId);
    } else {
      console.log('Please swipe again');
    }
  });
} else {
  console.log("Please connect the device");
}

device.on('error', function(err){
  if(err) throw err;
  console.log("Please swipe again");
  device.close();
})
