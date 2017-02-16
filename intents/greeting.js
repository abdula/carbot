function conversation(message, convo) {
    convo.say("My job is to solve your problems")
    convo.ask({
        text: 'What is the problem do you have today?',
        quick_replies: [{
                "content_type": "text",
                "title": "manual",
                "payload": "__goto__manual",
            },
            {
                "content_type": "text",
                "title": "I had an accident",
                "payload": "__goto__accident",
            }
        ]
    }, function(response, convo) {
        // whoa, I got the postback payload as a response to my convo.ask!
        console.log(response);
        convo.task.botkit.trigger('message_received', [convo.task.bot, response]);
        convo.next();
    });
}

function handle(bot, message) {
    bot.startConversation(message, conversation);
}

function intent(controller, bot) {
    controller.hears(['^hi', '^hello'], 'message_received', handle);
}

module.exports = {
    conversation: conversation,
    handle: handle,
    intent: intent
};