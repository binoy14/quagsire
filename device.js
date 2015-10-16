var device = require('./helpers/findDevice');
var getId = require('./helpers/getId');
var fs = require('fs');

if(device){
  device.on('data', function(info){
    document.getElementById('error').style.display = 'none';
    var hex = info.toString('hex');
    var cardDataHex = hex.split('');
    var finalId = getId(cardDataHex);
    if (finalId != false) {
      document.getElementById('student-id').innerHTML = finalId;
      fs.appendFileSync('/Users/binoy/Documents/Five_Tech/College_Projects/ACM/attendence.txt', finalId + '\n');
    } else {
      document.getElementById('error').style.display = 'block';
    }
  });
} else {
  document.getElementById('error-2').style.display = 'block';
}

device.on('error', function(err){
  if(err) throw err;
  document.getElementById('error').style.display = 'block';
  device.close();
})
