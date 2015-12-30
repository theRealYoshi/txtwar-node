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

- Upon Verification:
  - User sends text message to number, Twilio API receives all incoming requests

- Asynchronous web-worker model with AMQP and CloudAMQP
  - Receiving a Text message
    - All incoming messages processed immediate, those that have appropriate delay times are sent as messages to CloudAMQP
    - CloudAMQP creates queue with message expiration time based on contents of text message
    - Upon message expiration time messages are "dead-lettered" or transferred to one single destination queue
    // gif this
    - Original queue is deleted in CloudAMQP

  - Sending a delayed Text message (PUB/SUB format)
    - Worker scrapes the destination queue every minute
    - If there are messages in the destination queue, the queue is emptied and all messages transferred to the worker
    // show the code here
    - Text message is sent back to phone number owner after delayed time.
      - ![wrong_email](https://cloud.githubusercontent.com/assets/1275250/11703379/c5f165ce-9e93-11e5-8c52-5810edeb4e06.gif)

## Future implementations

 - [ ] Send a delayed text by texting the twilio number
