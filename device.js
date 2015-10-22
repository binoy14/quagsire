var device = require('./helpers/findDevice');
var getId = require('./helpers/getId');
var moment = require('moment');
var _ = require('lodash');

// Firebase
var Firebase = require('firebase');
var rootRef = new Firebase('https://api-demo.firebaseio.com/');
var membersRef = rootRef.child('members');
var newDate = new Date("11-23-2015");
var date = moment().format("MM-DD-YYYY");
var meetingRef = rootRef.child('meetings').child(date);
var finalId;

if(device){
  device.on('data', function(num){
    finalId = getId(num);
    var name;
    if (finalId != false) {
      hideElem('#error');
      hideElem('#success');
      membersRef.child(finalId).on('value', function(snap){
        if(!snap.val()){
          showElem('#info-form');
        } else {
          name = snap.val().firstName + ' ' + snap.val().lastName;
          var obj = {};
          obj[finalId] = true;
          meetingRef.update(obj);
          showSuccessfullMessage(name);
        }
      });
      showStudentId(finalId);
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

function showSuccessfullMessage(name){
  $('#signed-name').html(name);
  showElem('#success');
}

$.validator.addMethod('ucid', function(value, element){
  return /^[a-z].+\d$/ig.test(value);
}, 'Please enter a valid UCID');


$('#info-form').validate({
    rules : {
      ucid : "required ucid",
      firstName : "required",
      lastName : "required"
    },
  });

$('#info-form').submit(function(e){
  e.preventDefault();
  if($(this).valid()){
    var ucid = $('#ucid').val();
    var firstName = $('#first-name').val();
    var lastName = $('#last-name').val();
    var email = ucid + '@njit.edu';

    membersRef.child(finalId).set({
      ucid : ucid,
      email : email,
      firstName : firstName,
      lastName : lastName
    });
    hideElem('#info-form');
  }
});
