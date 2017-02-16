function conversation(message, convo) {
    convo.ask('Are you sure you want me to shutdown?', [{
            pattern: convo.context.bot.utterances.yes,
            callback: function(response, convo) {
                convo.say('Bye!');
                convo.next();
            }
        },
        {
            pattern: convo.context.bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
    ]);
}

function handle(bot, message) {
    bot.startConversation(message, conversation);
}

function intent(controller, bot) {
    controller.hears(['shutdown'], 'message_received', handle);
}

module.exports = {
    conversation: conversation,
    handle: handle,
    intent: intent
};