//https://github.com/howdyai/botkit-starter-facebook
//https://github.com/mvaragnat/botkit-messenger-express-demo
//https://github.com/watson-developer-cloud/botkit-middleware/tree/master/examples/multi-bot
//wit.ai 
//https://chatbotsmagazine.com/the-complete-beginner-s-guide-to-chatbots-8280b7b906ca#.wgiwr0oed
//https://cleverbot.io/
//https://botlist.co/
//https://dashboard.chatfuel.com

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

var controller = Botkit.facebookbot({
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

controller.api.thread_settings.greeting('Hello! I\'m a Can I Help You?!');
controller.api.thread_settings.get_started('sample_get_started_payload');
controller.api.thread_settings.menu([{
        "type": "postback",
        "title": "Hello",
        "payload": "hello"
    },
    {
        "type": "postback",
        "title": "Help",
        "payload": "help"
    },
    {
        "type": "web_url",
        "title": "Botkit Docs",
        "url": "https://github.com/howdyai/botkit/blob/master/readme-facebook.md"
    },
]);

controller.hears(['quick'], 'message_received', function(bot, message) {

    bot.reply(message, {
        text: 'Hey! This message has some quick replies attached.',
        quick_replies: [{
                "content_type": "text",
                "title": "Yes",
                "payload": "yes",
            },
            {
                "content_type": "text",
                "title": "No",
                "payload": "no",
            }
        ]
    });

});

controller.hears(['^hello', '^hi'], 'message_received,facebook_postback', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});


controller.hears(['structured'], 'message_received', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.ask({
            attachment: {
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [{
                            'title': 'Classic White T-Shirt',
                            'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                            'subtitle': 'Soft white cotton t-shirt is back in style',
                            'buttons': [{
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=100',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'White T-Shirt'
                                }
                            ]
                        },
                        {
                            'title': 'Classic Grey T-Shirt',
                            'image_url': 'http://petersapparel.parseapp.com/img/item101-thumb.png',
                            'subtitle': 'Soft gray cotton t-shirt is back in style',
                            'buttons': [{
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=101',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=101',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'Grey T-Shirt'
                                }
                            ]
                        }
                    ]
                }
            }
        }, function(response, convo) {
            // whoa, I got the postback payload as a response to my convo.ask!
            convo.next();
        });
    });
});

// controller.hears(['call me (.*)', 'my name is (.*)'], 'message_received', function(bot, message) {
//     var name = message.match[1];
//     controller.storage.users.get(message.user, function(err, user) {
//         if (!user) {
//             user = {
//                 id: message.user,
//             };
//         }
//         user.name = name;
//         controller.storage.users.save(user, function(err, id) {
//             bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
//         });
//     });
// });

controller.hears(['what is my name', 'who am i'], 'message_received', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [{
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, { 'key': 'nickname' }); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(['shutdown'], 'message_received', function(bot, message) {
    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [{
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
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



controller.on('message_received', function(bot, message) { //default message
    bot.reply(message, 'Try: `what is my name` or `structured` or `call me captain`');
    return false;
});

controller.on('facebook_optin', function(bot, message) {
    bot.startConversation(message, function(err, convo) {
        convo.ask({
            text: 'Hey! How are you bro?. What can i help You?',
            quick_replies: [{
                    "content_type": "text",
                    "title": "Fix my car",
                    "payload": "fix car",
                },
                {
                    "content_type": "text",
                    "title": "No",
                    "payload": "no",
                }
            ]

        }, function(response, convo) {
            // whoa, I got the postback payload as a response to my convo.ask!
            convo.next();
        })
    });
});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}