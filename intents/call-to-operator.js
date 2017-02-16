function askConfirm(response, convo) {
    convo.ask('Call you on this number `' + response.text + '`?', [{
            pattern: 'yes',
            callback: function(response, convo) {
                convo.say("Ok. We will soon call you. Please wait..");
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
}

function askPhoneNumber(message, convo) {
    convo.ask("Please fill your phone number?", function(response, convo) {
        askConfirm(response, convo);
        convo.next();
    });
}

function askTalkWithOperator(message, convo) {
    convo.ask({
        text: 'Would you like talk with operator?',
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
    }, [{
            pattern: convo.context.bot.utterances.yes,
            callback: function(response, convo) {
                askPhoneNumber(response, convo);
                convo.next();
            },
        },
        {
            pattern: convo.context.bot.utterances.no,
            callback: function(response, convo) {
                convo.say("Ok");
                convo.next();
            }
        },
        {
            default: true,
            callback: function(response, convo) {
                convo.repeat();
                convo.next();
            },
        }
    ]);
}

function conversation(message, convo) {
    askTalkWithOperator(message, convo);
}

function handle(bot, message) {
    bot.startConversation(message, conversation);
}

function intent(controller, bot) {
    controller.hears(['back call'], 'message_received', handle);
}

module.exports = {
    conversation: conversation,
    handle: handle,
    intent: intent
};