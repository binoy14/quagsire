var device = require('./helpers/findDevice');
var getId = require('./helpers/getId');
var fs = require('fs');

if(device){
  device.on('data', function(info){
    hideElem('#error');
    var hex = info.toString('hex');
    var cardDataHex = hex.split('');
    var finalId = getId(cardDataHex);
    if (finalId != false) {
      showStudentId(finalId);
      //fs.appendFileSync('/Users/binoy/Documents/Five_Tech/College_Projects/ACM/attendence.txt', finalId + '\n');
    } else {
      showElem('#error');
    }
  });

  device.on('error', function(err){
    if(err) throw err;
    showElem('#error');
    device.close();
  });
} else {
  showElem('#error-2');
}

/* 
  Helper Functions
 */ 

function showElem(id){
  $(id).removeClass('hidden').addClass('animated fadeIn');
  $(id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    $(this).removeClass('animated fadeIn');
  });
}

function hideElem(id){
  $(id).addClass('animated fadeOut'); 
  $(id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    $(this).removeClass('animated fadeOut').addClass('hidden');
  });
}

function showStudentId(id){
  $('#student-id').html(id);
}
