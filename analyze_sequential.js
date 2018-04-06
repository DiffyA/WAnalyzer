"use strict";

var messageAnalyzer = require('./MessageAnalyzer');
var conversationParser = require('./ConversationParser');
var conversationData = require('./ConversationData');

var chat_path = './_chat.txt';

function processMessage(message) {
    var message_type = messageAnalyzer.getMediaType(message);
    var message_sender = messageAnalyzer.getSender(message);
    var message_date = messageAnalyzer.getDate(message);

    // Add sender
    conversationData.addSender(message_sender);

    // Store message with media
    conversationData.addMessageMedia(message_sender, message_type);

    // Store message date
    conversationData.addMessageDate(message_date, message_type);
}

conversationParser.parse(chat_path, function(messages) {
    console.time("executionTime");

    messages.forEach(function(message) {

        processMessage(message);

    });

    console.timeEnd("executionTime");
});
