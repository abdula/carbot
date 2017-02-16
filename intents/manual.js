function askSections(message, convo) {
    convo.ask({
        attachment: {
            'type': 'template',
            'payload': {
                'template_type': 'generic',
                'elements': [{
                        'title': 'Engine',
                        'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                        'subtitle': 'Engine',
                        'buttons': [{
                            'type': 'web_url',
                            'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                            'title': 'View'
                        }]
                    },
                    {
                        'title': 'Сarcass',
                        'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                        'subtitle': 'Сarcass',
                        'buttons': [{
                            'type': 'web_url',
                            'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                            'title': 'View'
                        }]
                    }
                ]
            }
        }
    }, function(response, convo) {
        convo.next();
    });
}

function conversation(message, convo) {
    askSections(message, convo);
}

var manageCars = require('./manage-cars');

function handle(bot, message) {
    bot.startConversation(message, function(err, convo) {
        manageCars.conversation(message, convo);
        convo.on('end', function(convo) {
            bot.startConversation(message, conversation);
        });
    });
}

function intent(controller, bot) {
    controller.hears(['manual'], 'message_received', handle);
}

module.exports = {
    conversation: conversation,
    handle: handle,
    intent: intent
};

//engine is not start in ceed 2015