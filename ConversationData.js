"use strict";

function ConversationData() {
    // Participant
    this.senders = [];

    // Allowed media types
    this.mediaTypes = ['text', 'audio', 'image', 'video'];

    // Messages
    this.textMessages = 0;
    this.mediaMessages = 0;

    // Message dictionary
    this.messageDictionary = [];

    // Date dictionary containing amount of messages sent for that day
    this.dateFrequency = [];
}

/**
 * Adds a sender
 * @param name
 */
ConversationData.prototype.addSender = function(name) {
    this.senders.push(name);
}

/**
 * Increases the message counter for a given participant and media type
 * @param name
 */
ConversationData.prototype.addMessageMedia = function(name, type) {

    // Checks if the provided type is supported
    if (this.mediaTypes.indexOf(type.trim().toLowerCase()) <= -1) {
        return new Error("Media type '" + type + "' not supported.");
    }

    // Adds the corresponding value to the dictionary
    if (this.messageDictionary[name] != undefined) { // If the sender has been indexed before
        this.messageDictionary[name][type] += 1;
    }
    else {
        // Instantiate all media types to 0
        var media_types = {};

        this.mediaTypes.forEach(function(type) {
            media_types[type] = 0;
        })

        // Append the media_type object counter and add one to the corresponding type
        this.messageDictionary[name] = media_types;
        this.messageDictionary[name][type] += 1;
    }
}


/**
 * Increases the message counter for a given message media type on a specific date
 * @param date
 * @param type
 */
ConversationData.prototype.addMessageDate = function(date, type) {

    if (this.dateFrequency[date] != undefined) {
        this.dateFrequency[date][type] += 1;
    }
    else {
        // Instantiate all media types to 0
        var media_types = {};

        this.mediaTypes.forEach(function(type) {
            media_types[type] = 0;
        })

        // Append the media_type object counter and add one to the corresponding type
        this.dateFrequency[date] = media_types;
        this.dateFrequency[date][type] += 1;
    }
}
module.exports = new ConversationData();