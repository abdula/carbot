//https://github.com/howdyai/botkit-starter-facebook
//https://github.com/mvaragnat/botkit-messenger-express-demo
//https://github.com/watson-developer-cloud/botkit-middleware/tree/master/examples/multi-bot
//wit.ai 
//https://chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-8280b7b906ca#.wgiwr0oed
//https://cleverbot.io/
//https://botlist.co/
//https://dashboard.chatfuel.com
var Botkit = require('botkit');

function createBot(botname) {
    var page_token = botname;
    var page_id = botname;
    var verify_token = botname;
    var app_id = botname;
    var app_secret = botname;
    var ops = {
        lt: true,
        ltsubdomain: 'ivanbot'
    };
    var os = require('os');
    var localtunnel = require('localtunnel');
    var ngrock = require('ngrok');

    var controller = Botkit.facebookbot({
        access_token: page_token,
        verify_token: verify_token,
        app_secret: app_secret,
        validate_requests: true, // Refuse any requests that don't come from FB on your receive webhook, must provide FB_APP_SECRET in environment variables
    });

    var bot = controller.spawn({});

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

    controller.on('facebook_postback', function(bot, message) {
        console.log(message.payload);
        switch (message.payload) {
            case "get_started":
                console.log('get started reply send');
                bot.reply(message, "Hello {{user_name}}, I'm helping people with their car. ");
                break;
            default:
                bot.reply(message, 'Postback received');
                break;
        }
        console.log('Postback', message);
        return false;
    });

    return bot;
}

var bot1 = createBot('#1');
var bot2 = createBot('#2');

console.log('Bot #1', bot1);
console.log('--------------------------------------')
console.log('Bot #2', bot2);
console.log('--------------------------------------')
console.log(Object.keys(Botkit.core));