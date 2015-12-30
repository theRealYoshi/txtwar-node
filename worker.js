var secrets = require('./secrets')

//twilio
var twilioAccountSid = secrets.twilio.sid;
var twilioAuthToken = secrets.twilio.token;
var twilio = require('twilio');
var LookupsClient = twilio.LookupsClient;
var twilioLookupClient = new LookupsClient(twilioAccountSid, twilioAuthToken);
var twilioClient = twilio(twilioAccountSid, twilioAuthToken);

//AMQP
var amqp = require('amqplib');
var count = 1;

amqp.connect("amqp://mxsdqzbc:CpqLpEM4cnDpw0slWRyEP-P_RaTCoZq4@hyena.rmq.cloudamqp.com/mxsdqzbc").then(function(conn){
  return conn.createChannel().then(function(ch){
    var scrapeQueue = function(ch, test_message){
      ch.assertExchange("dead_exchange", "direct", { durable: true }).then(function(){
        return ch.assertQueue('destination_queue', { durable: true }).then(function(qok){
          return ch.bindQueue(qok.queue, 'dead_exchange', "").then(function(){
            return ch.consume(qok.queue, logMessage, {noAck: true}).then(function(){
              console.log(test_message);
            });
          });
        });
      })
    }
    function logMessage(msg){
      if (!msg) { return null; }
      var opts = {
        to: msg.content.toString(),
        from: secrets.twilio.number,
        body: "Text them back now!"
      }
      try {
        twilioClient.sendMessage(opts, function(err, response){
          if (err && err.status === 400 && err.code === 21608){
            return res.status(400).send("Unverified Number");
          } else if (err){
            return next(err);
          }
          console.log(msg.content.toString());
        })
      } catch (e) {
        res.status(404).send('Message could not be sent');
      }
    }

    setInterval(function(){
      var test_message = "Scrape Count: " + count;
      scrapeQueue(ch, test_message);
      count += 1;
    }, 60000);
  });
});
