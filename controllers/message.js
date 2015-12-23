var PhoneNumber = require('../models/phonenumbers');

// Create a function to handle Twilio SMS / MMS webhook requests
exports.webhook = function(request, response) {
  var phone = request.body.From;
  console.log(request);
  console.log(phone);
}
