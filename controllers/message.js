var PhoneNumber = require('../models/phonenumbers');
var secrets = require('../secrets');
var bcrypt = require('bcrypt');
//twilio
var twilioAccountSid = secrets.twilio.sid;
var twilioAuthToken = secrets.twilio.token;
var twilio = require('twilio');
var twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = function(request, response) {
  var phoneNumber = request.body.From;
  try {
    PhoneNumber.findOne({phoneNumber: phoneNumber}, function(err, number){
      if (err) return next(err);
      if (!number){
        var body = "Sign up for txtwar here: www.txtwar.com";
        sendMessage(phoneNumber, body);
      } else {
        if (!number.verified){
          var body = request.body.Body || "";
          msg = body.toString().trim();
          if (checkVerification(msg, number)){
            // verify the code and change the database
            PhoneNumber.update({ _id: number._id},
                               { $set: {verified: true} },
                               function(err){
                                 if (err) return next(err);
                                 var verified = "Verified! Start texting us for when you want a text back";
                                 sendMessage(phoneNumber, verified);
            })
          } else {
            var notVerified = "Please reply with the verification code. If you have misplaced your code please sign up again at www.txtwar.com"
            sendMessage(phoneNumber, notVerified);
          }
        } else {
          // delayed time to message
        }
      }
    })
  } catch (e) {
    console.log(e);
    console.log("an error occurred");
  }

  function checkVerification(body, number){
    var msg = body || "";
    msg = msg.toString().trim();
    if (bcrypt.compareSync(msg, number.phoneCodeHash)){
      return true;
    } else {
      return false;
    }
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
