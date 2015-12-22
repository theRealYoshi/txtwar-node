var mongoose = require('mongoose');

var phoneNumberSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, index: true},
  phoneNumberStripped: String,
  verified: {type: Boolean, default: false},
  delayTime: { type: Number, default: 5 }
})

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema);
