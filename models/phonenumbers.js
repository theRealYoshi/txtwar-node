var mongoose = require('mongoose');

// var characterSchema = new mongoose.Schema({
//   characterId: { type: String, unique: true, index: true },
//   name: String,
//   race: String,
//   gender: String,
//   bloodline: String,
//   wins: { type: Number, default: 0 },
//   losses: { type: Number, default: 0 },
//   reports: { type: Number, default: 0 },
//   random: { type: [Number], index: '2d' },
//   voted: { type: Boolean, default: false }
// });

var phoneNumberSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, index: true},
  phoneNumberStripped: String,
  delayTime: { type: Number, default: 5 }
})

module.exports = mongoose.model('PhoneNumber', phoneNumberSchema);
