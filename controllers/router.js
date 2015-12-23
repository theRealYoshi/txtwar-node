var message = require('./message');

// Map routes to controller functions
module.exports = function(app) {
    // Twilio SMS webhook route
    app.post('/incoming', message.webhook);
};
