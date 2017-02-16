function handle(bot, message) { //default message
    bot.reply(message, 'Sorry I don\'t understand. Please try another operation');
    return false;
}

function intent(controller, bot) {
    controller.on('message_received', handle);
}

module.exports = {
    handle: handle,
    intent: intent
};