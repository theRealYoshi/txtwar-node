# Txtwar

[Txtwar][Txtwar] - Know when to text them back! Delayed text messaging notifications

[Txtwar]: http://txtwar.herokuapp.com

## Description

- Single page web application utilizing React on the front-end, Node.js on the backend
  - Key packages for Node: Gulp, Babel, Browserify
  - React written in ES6 and integrating Flux Architecture
- Twilio API for phone number validation and SMS message sending
- Asynchronous Web-Worker Model using AMQPLib, CloudAMQP and Pub/Sub format
- Two Factor Authentication via bCrypt comparison

## Key Features

- Two Factor Authentication
  - User sent unique verification code
  - Once user responds with unique verification code user is verified with comparing hashed code with code sent
  - If User does not send correct verfication code, new unique code is resent, database is updated with updated hashed version
    - ![verified](https://cloud.githubusercontent.com/assets/1275250/12045915/e54ede8c-ae61-11e5-964d-0acfdfce5f98.gif)
    - ![text_not_verified](https://cloud.githubusercontent.com/assets/1275250/12045933/54b7a6e6-ae62-11e5-8d0f-ff83ef1f7434.PNG)
    - ![text_verified](https://cloud.githubusercontent.com/assets/1275250/12045932/54b4ecda-ae62-11e5-85bf-eca0a60b4c98.PNG)

- Upon Verification:
  - User sends text message to number, Twilio API receives all incoming requests
    - ![sent](https://cloud.githubusercontent.com/assets/1275250/12045934/54b8c1de-ae62-11e5-9354-c4e3ca78c480.PNG)

- Asynchronous web-worker model with AMQP and CloudAMQP
  - Receiving a Text message
    - All incoming messages processed immediate, those that have appropriate delay times are sent as messages to CloudAMQP
      - ![AMQPreceived](https://cloud.githubusercontent.com/assets/1275250/12045994/96c8eb66-ae63-11e5-9e40-9ba35bd93e50.png)
    - CloudAMQP creates queue with message expiration time based on contents of text message
    - Upon message expiration time messages are "dead-lettered" or transferred to one single destination queue
    - Original queue is deleted in CloudAMQP
      - ![queue_deleted](https://cloud.githubusercontent.com/assets/1275250/12046008/ceb79e5a-ae63-11e5-92ea-f39f64681b43.png)

  - Sending a delayed Text message (PUB/SUB)
    - Worker scrapes the destination queue every minute with SetInterval
      - ```javascript
        setInterval(function(){
          var test_message = "Scrape Count: " + count;
          scrapeQueue(ch, test_message);
          count += 1;
        }, 60000);
        ```
    - If there are messages in the destination queue, the queue is emptied and all messages transferred to the worker
      - ```javascript
          return ch.bindQueue(qok.queue, 'dead_exchange', "").then(function(){
            return ch.consume(qok.queue, logMessage, {noAck: true}).then(function(){
              console.log(test_message);
          });
        ```
    - Text message is sent back to phone number owner after the specified delayed time.
      - ![received](https://cloud.githubusercontent.com/assets/1275250/12045974/09aa9090-ae63-11e5-979b-04cff92328c2.PNG)

## Future implementations

 - [ ] Send a delayed text by texting the twilio number
