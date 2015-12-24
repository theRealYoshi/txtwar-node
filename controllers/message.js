var PhoneNumber = require('../models/phonenumbers');
var config = require('../config');

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = function(request, response) {
  var phoneNumber = request.body.From;
  console.log(request);
  console.log(phone);
  try {
    PhoneNumber.findOne({phoneNumber: phoneNumber}, function(err, number){
      if (err) return next(err);
      if (!number){
        var body = "Sign up for txtwar here: www.txtwar.com";
        sendMessage(phoneNumber, body);
      } else {
        if (!number.verified){
          var body = "Please send us your verification code, if you deleted it please sign up again at www.txtwar.com";
          sendMessage(phoneNumber, body);
        } else {
          processMessage(request.body)
        }
      }
    })
  } catch (e) {
    console.log(e);
    console.log("an error occurred");
  }

  function processMessage(body){
    var msg = body || "";
    msg = msg.toString().trim();
    console.log(msg);


  }

  function sendMessage(phoneNumber, body){
    var options = {
      to: phoneNumber,
      from: secrets.twilio.number,
      body: body
    }
    try {
      twilioClient.sendMessage(options, function(err, response){
        if (err && err.status === 400 && err.code === 21608){
          console.log("unverified number")
        } else if (err){
          return next(err);
        }
        console.log("message sent")
      })
    } catch (e) {
      console.log("errred out");
    }
  }


  // if it doesn't fit the parameters return error text
  // if it does delay scheduling a message

  // if it hasn't been verified resend the verification code with bcrypt

  // move some of the logic into the model layer

  // check
}
