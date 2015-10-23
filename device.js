var device = require('./helpers/findDevice');
var getId = require('./helpers/getId');
var moment = require('moment');
var config = require('./config');
var _ = require('lodash');

// Firebase
var Firebase = require('firebase');
var rootRef = new Firebase(config.firebaseUrl);
rootRef.authWithCustomToken(config.firebaseSecret, function(err, authData) {
  if (err) {
    alert("Error with authentication");
    throw err;
  } else {
    console.log("Login succeeded!", authData);
  }
});

var membersRef = rootRef.child('members');
var date = moment().format("MM-DD-YYYY");
var meetingRef = rootRef.child('meetings').child(date);
var finalId;

if (device) {
  device.on('data', function(num) {
    finalId = getId(num);
    var name;
    if (finalId != false) {
      hideElem('#error');
      hideElem('#success');
      membersRef.child(finalId).on('value', function(snap) {
        if (!snap.val()) {
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

  device.on('error', function(err) {
    if (err) throw err;
    showElem('#error');
    device.close();
  });
} else {
  showElem('#error-2');
}

/* 
  Helper Functions
 */

$('.selectpicker').selectpicker();

function showElem(id) {
  $(id).removeClass('hidden').addClass('animated fadeIn');
  $(id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    $(this).removeClass('animated fadeIn');
  });
}

function hideElem(id) {
  $(id).addClass('animated fadeOut');
  $(id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
    $(this).removeClass('animated fadeOut').addClass('hidden');
  });
}

function showStudentId(id) {
  $('#student-id').html(id);
}

function showSuccessfullMessage(name) {
  $('#signed-name').html(name);
  showElem('#success');
}

$.validator.addMethod('ucid', function(value, element) {
  return /^[a-z].+\d$/ig.test(value);
}, 'Please enter a valid UCID');


$('#info-form').validate({
  rules: {
    ucid: "required ucid",
    firstName: "required",
    lastName: "required",
    major: "required",
    standing: "required"
  },
  ignore: ':not(select:hidden, input:visible, textarea:visible)',
  errorPlacement: function(error, element) {
    if (element.hasClass('selectpicker')) {
      error.insertAfter('.bootstrap-select');
    } else {
      error.insertAfter(element);
    }
  },
  messages: {
    'standing': "Please select class standing"
  }
});

var onComplete = function(err){
  if(err){
    throw err;
    alert('Please swipe again');
  } else {
    $('#ucid').val('');
    $('#first-name').val('');
    $('#last-name').val('');
    $('#major').val('');
    $('#standing').val('');
  }
};

$('#info-form').submit(function(e) {
  e.preventDefault();
  if ($(this).valid()) {
    var ucid = $('#ucid').val();
    var firstName = $('#first-name').val();
    var lastName = $('#last-name').val();
    var major = $('#major').val();
    var standing = $('#standing').val();
    var email = ucid + '@njit.edu';

    membersRef.child(finalId).set({
      ucid: ucid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      standing: standing,
      major: major
    }, onComplete);
    hideElem('#info-form');
  }
});
