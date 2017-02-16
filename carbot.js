var page_token = "EAAQa4jfZBy80BABUAf6hZAVFkBDtNRi25H2CxbWybrjZBTQ83XyyX3d19c1jK5CUZBVh1B84njhVHuG3JxZCR2FjgWoKa06fYWZBEYZANtH7ZAwgc8dLXZAa3qZAayPW7dg5ZBwKaVWnu7REvOfOT61HTY3EYfBcRcHM92kCm2oabO5rQZDZD";
var verify_token = "18hGLBHwl86KE6m16zkCwRe1E6xCLH5Jt2nDp2RY5Xg";
var app_secret = "8623a7ec3570bba385b4eca733896a9e";
var ops = {
    lt: true,
    ltsubdomain: 'ivanbot'
};
var Botkit = require('botkit');
var os = require('os');
var localtunnel = require('localtunnel');

var controller = Botkit.facebookbot({
    require_delivery: true,
    debug: false,
    access_token: page_token,
    verify_token: verify_token,
    app_secret: app_secret,
    receive_via_postback: true,
    validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
});

var bot = controller.spawn({});

controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
    });
});

controller.api.thread_settings.greeting('Thanks for messaging us {{user_name}}. We try to be as responsive as possible. We\'ll respond to you soon!');
controller.api.thread_settings.get_started('Hi');
controller.api.thread_settings.menu([{
        "type": "postback",
        "title": "About Car Bot",
        "payload": "__goto__about"
    },
    {
        "type": "web_url",
        "title": "Docs",
        "url": "https://github.com/howdyai/botkit/blob/master/readme-facebook.md"
    }
]);

require('./intents/go-to').intent(controller, bot);
require('./intents/about').intent(controller, bot);
require('./intents/manage-cars').intent(controller, bot);
require('./intents/manual').intent(controller, bot);
require('./intents/call-to-operator').intent(controller, bot);
require('./intents/greeting').intent(controller, bot);
require('./intents/shutdown').intent(controller, bot)
require('./intents/fallback').intent(controller, bot);