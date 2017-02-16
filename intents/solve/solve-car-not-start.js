module.exports = (controller, bot, message, convo) => {
    function askTalkWithOperator(convo, message) {
        convo.ask("Do you want to talk with operator?", [{
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say("Ok. We will soon call you. Please wait..");
                    convo.next();
                },
            },
            {
                pattern: bot.utterances.no,
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

    function askBattery(convo, message) {
        convo.ask('The battery is charged?', [{
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say("Unfortunately, I don't know how to help you.");
                    askTalkWithOperator(convo, message);
                },
            },
            {
                pattern: bot.utterances.no,
                callback: function(response, convo) {
                    convo.say("Awesome. I glad to help you");
                    convo.next();
                },
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

    function askGAS(convo, message) {
        convo.ask("The tank has a fuel?", [{
                pattern: 'yes',
                callback: function(response, convo) {
                    askBattery(convo, message)
                },
            },
            {
                pattern: 'no',
                callback: function(response, convo) {
                    convo.say("Awesome. I glad to help you");
                    convo.next();
                },
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

    askGAS(convo, message);
};