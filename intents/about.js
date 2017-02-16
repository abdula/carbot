function conversation(message, convo) {
    convo.say('Main goal of this chat bot to help people with their ordinary car problems.');
}

function handle(bot, message) {
    bot.startConversation(message, conversation);
}

function intent(controller, bot) {
    controller.hears(['about'], 'message_received', handle);
}

module.exports = {
    conversation: conversation,
    handle: handle,
    intent: intent
};