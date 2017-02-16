//https://github.com/howdyai/botkit-starter-facebook
//https://github.com/mvaragnat/botkit-messenger-express-demo
//https://github.com/watson-developer-cloud/botkit-middleware/tree/master/examples/multi-bot
//wit.ai 
//https://chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-8280b7b906ca#.wgiwr0oed
//https://cleverbot.io/
//https://botlist.co/
//https://dashboard.chatfuel.com
//https://help.chatfuel.com/facebook-messenger/plugins/json-plugin/

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


controller.hears(['shutdown'], 'message_received', function(bot, message) {
    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [{
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                }
            },
            {
                pattern: bot.utterances.no,
                default: true,
                callback: function(response, convo) {
                    convo.say('*Phew!*');
                    convo.next();
                }
            }
        ]);
    });
});

controller.hears(['hello', 'hi'], 'message_received', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

controller.on('facebook_postback', function(bot, message) {
    console.log(message.payload);
    switch (message.payload) {
        case "get_started":
            console.log('get started reply send');
            bot.reply(message, "Hello. I'm helping people with their car. ");
            bot.reply(message, "What problem do you have ")
            break;
        default:
            bot.reply(message, 'Postback received');
            break;
    }
    console.log('Postback', message);
    return false;
});

controller.hears('new question', 'message_received', function(bot, message) {
    bot.createConversation(message, function(err, convo) {
        convo.addMessage({
            text: 'You said yes! New topic.',
        }, 'new_yes_thread');

        convo.activate();
    });
});

controller.hears('module-1', 'message_received', function(bot, message) {

});

controller.hears('question me', 'message_received', function(bot, message) {
    bot.createConversation(message, function(err, convo) {
        convo.addMessage({
            text: 'You said yes! How wonderful.',
        }, 'yes_thread');

        convo.addMessage({
            text: 'You said no, that is too bad.',
        }, 'no_thread');

        // create a path where neither option was matched
        // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
        convo.addMessage({
            text: 'Sorry I did not understand.',
            action: 'default',
        }, 'bad_response');

        // Create a yes/no question in the default thread...
        convo.ask('Do you like cheese?', [{
                pattern: 'yes',
                callback: function(response, convo) {
                    convo.changeTopic('yes_thread');
                },
            },
            {
                pattern: 'no',
                callback: function(response, convo) {
                    convo.changeTopic('no_thread');
                },
            },
            {
                default: true,
                callback: function(response, convo) {
                    convo.changeTopic('bad_response');
                },
            }
        ]);

        convo.activate();
    });
});


controller.on('message_received', function(bot, message) { //default message
    console.log(message);
    bot.reply(message, 'Try: `what is my name` or `structured` or `call me captain`');
    return false;
});