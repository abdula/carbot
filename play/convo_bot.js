var page_token = "EAAQa4jfZBy80BABUAf6hZAVFkBDtNRi25H2CxbWybrjZBTQ83XyyX3d19c1jK5CUZBVh1B84njhVHuG3JxZCR2FjgWoKa06fYWZBEYZANtH7ZAwgc8dLXZAa3qZAayPW7dg5ZBwKaVWnu7REvOfOT61HTY3EYfBcRcHM92kCm2oabO5rQZDZD";
var page_id = "1465148870195993";
var verify_token = "18hGLBHwl86KE6m16zkCwRe1E6xCLH5Jt2nDp2RY5Xg";
var app_id = "1155458811218893";
var app_secret = "8623a7ec3570bba385b4eca733896a9e";
var ops = {
    lt: true,
    ltsubdomain: 'ivanbot'
};
var Botkit = require('botkit');
var os = require('os');
var localtunnel = require('localtunnel');
var ngrock = require('ngrok');

var controller = Botkit.facebookbot({
    require_delivery: true,
    debug: true,
    log: true,
    access_token: page_token,
    verify_token: verify_token,
    app_secret: app_secret,
    validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
});

var bot = controller.spawn({});

controller.setupWebserver(process.env.port || 3000, function(err, webserver) {
    controller.createWebhookEndpoints(webserver, bot, function() {
        console.log('ONLINE!');
        if (ops.lt) {
            var tunnel = localtunnel(process.env.port || 3000, { subdomain: ops.ltsubdomain }, function(err, tunnel) {
                if (err) {
                    console.log(err);
                    process.exit();
                }
                console.log("Your bot is available on the web at the following URL: " + tunnel.url + '/facebook/receive');
            });

            tunnel.on('close', function() {
                console.log("Your bot is no longer available on the web at the localtunnnel.me URL.");
                process.exit();
            });
        }
    });
});

controller.api.thread_settings.greeting('Thanks for messaging us {{user_name}}. We try to be as responsive as possible. We\'ll respond to you soon!');
controller.api.thread_settings.get_started('get_started');
controller.api.thread_settings.menu([{
        "type": "postback",
        "title": "About Car Bot",
        "payload": "about"
    },
    {
        "type": "postback",
        "title": "Help",
        "payload": "help"
    },
    {
        "type": "web_url",
        "title": "Docs",
        "url": "https://github.com/howdyai/botkit/blob/master/readme-facebook.md"
    }
]);

controller.hears(['pizzatime'], 'message_received', function(bot, message) {
    bot.startConversation(message, askFlavor);
});

askFlavor = function(response, convo) {
    convo.ask("What flavor of pizza do you want?", function(response, convo) {
        convo.say("Awesome.");
        askSize(response, convo);
        convo.next();
    });
}
askSize = function(response, convo) {
    convo.ask("What size do you want?", function(response, convo) {
        convo.say("Ok.")
        askWhereDeliver(response, convo);
        convo.next();
    });
}
askWhereDeliver = function(response, convo) {
    convo.ask("So where do you want it delivered?", function(response, convo) {
        convo.say("Ok! Goodbye.");
        convo.next();
    });
}