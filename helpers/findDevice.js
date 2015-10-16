var HID = require('node-hid');
var devices = HID.devices();
var resultObject = search(2049, devices);

function search(nameKey, myArray) {
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].vendorId === nameKey) {
            return myArray[i];
        }
    }
}

if(!resultObject) {
  module.exports = false;
} else {
  module.exports = new HID.HID(resultObject.path);
}
