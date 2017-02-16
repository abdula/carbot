function askEngineVolume(message, convo) {}

function askHorsepower(message, convo) {}

function askModel(message, convo) {
    convo.ask('What is the model of your car?', function(response, convo) {
        console.log(convo.task.botkit.storage);
        convo.task.botkit.storage.users.save({ id: response.user, car_model: response.text }, function(err) {
            askYear(response, convo);
        });
        convo.next();
    });
}

function askYear(message, convo) {
    convo.ask('What is the year of manufacture?', function(response, convo) {
        convo.task.botkit.storage.users.save({ id: response.user, car_year: response.text }, function(err) {
            convo.next();
            //askModel(response, convo);
        });
    });
}

function conversation(message, convo) {
    askModel(message, convo);
}

function handle(bot, message) {
    bot.startConversation(message, conversation);
}

function intent(controller, bot) {
    controller.hears(['add car'], 'message_received', handle);
}

module.exports = {
    conversation: conversation,
    handle: handle,
    intent: intent
};