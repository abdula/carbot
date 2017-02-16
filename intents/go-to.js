var path = require('path');

module.exports = {
    intent: function(controller, bot) {
        controller.hears('^__goto__', 'message_received,facebook_postback', function(bot, message) {
            let handlerPath = path.join(__dirname, message.text.replace('__goto__', ''));
            require(handlerPath).handle(bot, message);
        });
    }
}