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

// Configure application routes for message reply back
require('./controllers/router')(app);

/**
 * POST /api/phonenumbers/
 * assigns random search tag to email caches result
 **/

var amqp = require('amqplib');

app.get("/api/amqp", function(req, res, next){
  var action = req.query.action;
  console.log(action);
  if (action === "publish"){
    amqp.connect("amqp://mxsdqzbc:CpqLpEM4cnDpw0slWRyEP-P_RaTCoZq4@hyena.rmq.cloudamqp.com/mxsdqzbc").then(function(conn){
      return conn.createChannel().then(function(ch){
        var exchangeOk = ch.assertExchange("delay_exchange", "direct");
        exchangeOk = exchangeOk.then(function(){
          var qOpts = {
            durable: true,
            arguments: {
              exclusive: true,
              "x-dead-letter-exchange": "dead_exchange",
              "x-dead-letter-routing-key": "destination_queue",
              "x-expires": 60000 }
          };
          return ch.assertQueue("", qOpts);
        });
        exchangeOk = exchangeOk.then(function(queueOk){
          var queue = queueOk.queue;
          ch.sendToQueue(queue, new Buffer("this is an amqp Test"),{ expiration: 30000 }, function(){
            return ch.close();
          });
        })
        return exchangeOk.then(function(){
          console.log("alll done");
        })
      })
    }, function(err){
      console.log(err);
    }).then(null, console.warn);
  } else {
    amqp.connect("amqp://mxsdqzbc:CpqLpEM4cnDpw0slWRyEP-P_RaTCoZq4@hyena.rmq.cloudamqp.com/mxsdqzbc").then(function(conn){
      return conn.createChannel().then(function(ch){
        var ok = ch.assertExchange("dead_exchange", "direct", { durable: true });
        ok = ok.then(function(){
          return ch.assertQueue('destination_queue', { durable: true });
        });
      ok = ok.then(function(qok){
        return ch.bindQueue(qok.queue, 'dead_exchange', "").then(function(){
          return qok.queue;
        })
      })
      ok = ok.then(function(queue){
        return ch.consume(queue, logMessage, {noAck: true});
      })
      return ok.then(function(){
        console.log('message received');
      })
      function logMessage(msg){
        console.log(" [x] '%s' ", msg.content.toString());
      }
      })
    }, function(err){
      console.log(err);
    }).then(null, console.warn);

  }

  // var rabbit = jackrabbit("amqp://mxsdqzbc:CpqLpEM4cnDpw0slWRyEP-P_RaTCoZq4@hyena.rmq.cloudamqp.com/mxsdqzbc");
  // rabbit.on('connected', function(){
  //   console.log("Connected to RabbitMQ");
  // });
  // rabbit.on('disconnected', function(){
  //   console.log("Disconnected to RabbitMQ");
  // });

  // var hello = exchange.queue({ name: 'test_queue', durable: true, arguments:
  //   {"x-dead-letter-exchange": "dead_exchange", "x-dead-letter-routing-key": "destination_queue"}
  // });
  // var exchange = rabbit.default();
  // if (action === "publish"){
  //   var exchange = rabbit.direct("delay_exchange");
  //   exchange.publish({msg: "this is a random queue"}, {})
  //   exchange.publish({ msg: 'This is Shorter' }, { key: 'delay_queue', expiration: 1000});
  //   exchange.publish({ msg: 'This is Shorter' }, { key: 'delay_queue', expiration: 10000});
  //   exchange.publish({ msg: 'This Lasts Longer' }, { key: 'delay_queue', expiration: 90000});
  //   exchange.on("drain", rabbit.close);
  //   res.status(200).send();
  // } else {
  //   var deadExchange = rabbit.direct("dead_exchange");
  //   var destination = deadExchange.queue({name: "destination_queue", durable: true});
  //   destination.consume(onMessage);
  // }


  // add event listeners and then use worker processes.

  function onMessage(data, ack){
    console.log("received: ", data);
    ack();
    res.status(200).send();
  }

  function ready() {
    console.log("ready");
  }

  function lost() {
    console.log("lost");
  }

})



app.post("/api/phonenumbers/", function(req, res, next) {
  var phoneNumber = "+1" + req.body.phonenumber;
  async.waterfall([
    function(callback){
      try {
        redis.exists(phoneNumber, function(err, reply){
          if (reply === 1){
            res.status(409).send(phoneNumber + ' has already been saved.');
          } else {
            console.log('looking up for verification in twilio');
            twilioLookupClient.phoneNumbers(phoneNumber).get(function(err, number){
              if (err) return next(err);
                if (number){
                  callback(err, phoneNumber);
                }
            });
          }
        })
      } catch (e) {
        res.status(404).send("please choose a valid number");
      }
    },
    function(phoneNumber, callback) {
       try {
         PhoneNumber.findOne({ phoneNumber: phoneNumber }, function(err, number) {
           if (err) return next(err);
           if (number && !number.verified) {
             // resend the code to the phone new random code
             console.log("re-send code if not just saved");
             var resend = generateRandomSixDigitCode();
             var resalt = bcrypt.genSaltSync(10);
             var resendHashed = bcrypt.hashSync(resend, resalt);

             var options = {
               to: number.phoneNumber,
               from: secrets.twilio.number,
               body: "Please reply back with this code: " + resend
             }
             twilioClient.sendMessage(options, function(err, response){
               if (err && err.status === 400 && err.code === 21608){
                 return res.status(400).send("Unverified number");
               } else if (err){
                 return next(err);
               }
               PhoneNumber.update({ _id: number._id},
                                  { $set: { phoneCodeHash: resendHashed}},
                                  function(err){
                                    if (err) next(err);
                                    setRedis(number.phoneNumber);
                                    return res.status(200).send("verification code has been sent to " + number.phoneNumber);
               });
             })
           } else if (number && number.verified) {
             return res.status(409).send(number.phoneNumber + ' has already been saved.');
           } else {
             callback(err, phoneNumber);
           }
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
           setRedis(phoneNumber);
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
           if (err && err.status === 400 && err.code === 21608){
             return res.status(400).send("Unverified Number");
           } else if (err){
             return next(err);
           }
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

function setRedis(phoneNumber){
  redis.set(phoneNumber, true);
  redis.expire(phoneNumber, 300);
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
