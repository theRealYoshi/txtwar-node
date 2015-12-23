require('babel-core/register');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');

var mongoose = require('mongoose');
var PhoneNumber = require('./models/phonenumbers.js');

var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');
var config = require('./config');
var secrets = require('./secrets')
var bcrypt = require('bcrypt');


//twilio
var twilioAccountSid = secrets.twilio.sid;
var twilioAuthToken = secrets.twilio.token;
var twilio = require('twilio');
var LookupsClient = twilio.LookupsClient;
var twilioLookupClient = new LookupsClient(twilioAccountSid, twilioAuthToken);
var twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Redis
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}
// Connect to Redis server
redis.on('connect', function() {
    console.log('connected to Redis');
});
// error handlers
redis.on('error', function (err) {
  console.log('Error ' + err);
});

//mongodb
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /api/phonenumbers/
 * assigns random search tag to email caches result
 */

app.post("/api/phonenumbers/", function(req, res, next) {
  var phoneNumber = "+1" + req.body.phonenumber;
  async.waterfall([
    function(callback){
      twilioLookupClient.phoneNumbers(phoneNumber).get(function(err, number){
        if (err) return next(err);
        try {
          if (number){
            callback(err, phoneNumber);
          }
        } catch (e) {
          res.status(404).send("please choose a valid number");
        }
      });
    },
    function(phoneNumber, callback) {
       try {
         PhoneNumber.find({}, function(err, numbers){
           numbers.forEach(function(number){
             console.log(number);
           })
         });
         PhoneNumber.findOne({ phoneNumber: phoneNumber }, function(err, number) {
           if (err) return next(err);
           if (number) {
             return res.status(409).send(phoneNumber + ' has already been saved.');
           }
           // else if number && !verified then resend new code to update database
           callback(err, phoneNumber);
         });
       } catch (e) {
         return res.status(400).send('XML Parse Error');
       }
     },
     function(phoneNumber, callback) {
       try {
         var phoneCode = generateRandomSixDigitCode();
         var salt = bcrypt.genSaltSync(10);
         var phoneCodeHash = bcrypt.hashSync(phoneCode, salt);
         var newNumber = new PhoneNumber({
           phoneNumber: phoneNumber,
           phoneNumberStripped: phoneNumber.slice(2),
           phoneCodeHash: phoneCodeHash
         });
         newNumber.save(function(err) {
           if (err) return next(err);
           callback(err, phoneNumber, phoneCode);
         });
       } catch (e) {
         res.status(404).send(phoneNumber + ' could not be saved.');
       }
     },
     function(phoneNumber, phoneCode){
       var options = {
         to: phoneNumber,
         from: secrets.twilio.number,
         body: "Please reply back with this code: " + phoneCode
       }
       try {
         twilioClient.sendMessage(options, function(err, response){
           if (err) return next(err);
           res.status(200).send("verification code has been sent to " + phoneNumber);
         })
       } catch (e) {
         res.status(404).send(phoneNumber + ' could not be saved.');
       }
     }
   ]);
});

function generateRandomSixDigitCode(){
  var min = 100000;
  var max = 999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

app.use(function(req, res) {
 Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
   if (err) {
     res.status(500).send(err.message)
   } else if (redirectLocation) {
     res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
   } else if (renderProps) {
     var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
     var page = swig.renderFile('views/index.html', { html: html });
     res.status(200).send(page);
   } else {
     res.status(404).send('Page Not Found')
   }
 });
});

/**
 * Server
 */
var server = require('http').createServer(app);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
