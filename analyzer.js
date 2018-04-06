'use strict';

var parser = require('./ConversationParser');
var conversationData = require('./ConversationData');
const moment = require('moment');


parser.parse('_chat.txt', function(messages) {



    // conversationData.addMessageMedia("Mike", 'audio');
    // conversationData.addMessageMedia("Mike", 'audio');

    // Throws error
    // console.log(conversationData.addMessageMedia("Mike", 'pictureewewe'));

    // conversationData.addMediaMessage("Mike");
    // conversationData.addMediaMessage("Tim");

    // conversationData.addMessageMedia("Jhon", "picture");

    // console.log(conversationData.messageDictionary)

    // /*
    console.time("executionTime");
    console.log("# of messages: " + countMessages(messages));
    var senders = obtainSenders(messages);
    var sender_1 = senders.sender_1;
    var sender_2 = senders.sender_2;


    // Message breakdown
    messages.forEach(function(message) {
        var msg = JSON.parse(message);

        if (msg['content'].trim() === '<‎audio omitted>') {
            conversationData.addMessageMedia(msg['sender'], 'audio');
        }

        else if (msg['content'].trim() === '<‎image omitted>') {
            conversationData.addMessageMedia(msg['sender'], 'image');
        }

        else if (msg['content'].trim() === '<‎video omitted>') {
            conversationData.addMessageMedia(msg['sender'], 'video');
        }

        else {
            conversationData.addMessageMedia(msg['sender'], 'text');
        }


    })

    // Generating Date Frequency Dictionary
    messages.forEach(function(message) {
        var msg = JSON.parse(message);
        var date_t = moment(msg.date).format("DD-MM-YYYY");

        if (msg['content'].trim() === '<‎audio omitted>') {
            conversationData.addMessageDate(date_t, 'audio');
        }

        else if (msg['content'].trim() === '<‎image omitted>') {
            conversationData.addMessageDate(date_t, 'image');
        }

        else if (msg['content'].trim() === '<‎video omitted>') {
            conversationData.addMessageDate(date_t, 'video');
        }

        else {
            conversationData.addMessageDate(date_t, 'text');
        }
    });


    // console.log(conversationData.messageDictionary);
    // console.log(conversationData.dateFrequency);


    // General stats
    // console.log('----- GENERAL STATS -----');
    // console.log("# of messages: " + countMessages(messages));
    // console.log("Senders: " + JSON.stringify(obtainSenders(messages)));
    // console.log("Messages by sender 1: " + countMessagesOfAuthor(messages, sender_1))
    // console.log("Messages by sender 2: " + countMessagesOfAuthor(messages, sender_2))

    // Media
    // console.log('----- MEDIA -----');
    // console.log(countImages(messages));
    // console.log(countAudio(messages));

    // Temporal
    console.log('----- TEMPORAL DATA -----');
    console.log(countDays(messages));
    console.log(mostMessagedDay(generateDateMap(messages)));



    console.timeEnd("executionTime")
// */
});

/**
 * Counts the total amount of exchanged messages
 * @param messages
 */
function countMessages(messages) {
    return messages.length;
}

/**
 * Counts the amount of messages sent by a specific sender
 * @param messages
 * @param author
 * @returns {number}
 */
function countMessagesOfAuthor(messages, author) {
    var count = 0;

    messages.forEach(function(message) {

        if (JSON.parse(message).sender === author) {
            count++
        }
    })

    return count;
}

/**
 * Calculates the total number of days that have passed since the first and last message of the conversation.
 * @param messages
 * @returns {{first_day: *, last_day: *, total_days: *}}
 */
function countDays(messages) {
    var first_day = JSON.parse(messages[0]).date;
    var last_day = JSON.parse(messages[messages.length-1]).date;

    var days = moment(last_day).diff(moment(first_day), 'days');

    return {
        first_day: first_day,
        last_day: last_day,
        total_days: days
    }

}

/**
 * Creates a map-like object, mapping a date to the amount of messages sent on that date.
 * @param messages
 */
function generateDateMap(messages) {
    var dateMap = {};

    var currentDate;
    var currentCount = 0;

    for (let m of messages) {
        var message = JSON.parse(m);

        // Increase message counter
        currentCount++;

        var date = moment(message.date).format("DD-MM-YYYY");

        // If a new date is found, add previous to map and reset counter
        if(date != currentDate && currentDate !== undefined) {
            dateMap[currentDate] = currentCount;

            currentCount = 0;
        }

        currentDate = date;
    }

    return dateMap;
}

/**
 * Receives a mapping of dates to the amount of messages sent on that date. Returns the date with the most messages.
 * @param DateMap
 */
function mostMessagedDay(dateMap) {

    var highest_date;
    var current_highest = 0;

    for (var key in dateMap) {

        if (dateMap[key] > current_highest) {
            highest_date = key;
            current_highest = dateMap[key];
        }
    }

    return {
        most_messaged_date: highest_date,
        amount_of_messages: current_highest
    }
}

/**
 * Iterates through the messages to obtain the senders' names. Only iterates through the necessary messages until it identifies two senders.
 * @param messages
 */
function obtainSenders(messages) {

    var sender_1;
    var sender_2;

    for (let message of messages) {

        var sender = JSON.parse(message).sender;

        if (sender_1 === undefined) {
            if (message.sender != '') {
                sender_1 = sender;
            }
        }

        if (sender_2 === undefined && sender_1 != undefined) {
            if (message.sender != '' && sender != sender_1) {
                sender_2 = sender;
                break;
            }
        }
    }

    return {
        sender_1: sender_1,
        sender_2: sender_2
    }
}

/**
 * Obtains the amount of images sent by each sender in the conversation.
 * @param messages
 * @returns {{images: number, sender_1_images: number, sender_2_images: number}}
 */
function countImages(messages) {
    var count = 0;

    var sender_1_images = 0;
    var sender_2_images = 0;

    var senders = obtainSenders(messages);
    var sender_1 = senders.sender_1;
    var sender_2 = senders.sender_2;

    for(let m of messages) {
        var message = JSON.parse(m);

        if (message.content.indexOf("image omitted") > -1) {

            if (message.sender === sender_1) {
                sender_1_images++;
            }
            else if (message.sender === sender_2) {
                sender_2_images++;
            }
        }
    }

    return {
        images: sender_1_images + sender_2_images,
        sender_1_images: sender_1_images,
        sender_2_images: sender_2_images
    }
}

/**
 * Obtains the amount of audio notes sent by each sender in the conversation.
 * @param messages
 * @returns {{images: number, sender_1_audio: number, sender_2_audio: number}}
 */
function countAudio(messages) {
    var count = 0;

    var sender_1_audio = 0;
    var sender_2_audio = 0;

    var senders = obtainSenders(messages);
    var sender_1 = senders.sender_1;
    var sender_2 = senders.sender_2;

    for(let m of messages) {
        var message = JSON.parse(m);

        if (message.content.indexOf("audio omitted") > -1) {

            if (message.sender === sender_1) {
                sender_1_audio++;
            }
            else if (message.sender === sender_2) {
                sender_2_audio++;
            }
        }
    }

    return {
        audio_notes: sender_1_audio + sender_2_audio,
        sender_1_audio: sender_1_audio,
        sender_2_audio: sender_2_audio
    }
}


/**
 * Helper function used to find malformed messages
 * @param messages
 */
function messagesNoAuthor(messages) {

    var count = 0
    for (let m of messages) {



        var message = JSON.parse(m);

        var senders = obtainSenders(messages);

        if(message.sender != senders.sender_1 && message.sender != senders.sender_2) {
            console.log(message);
            count++;
        }


        if (count == 5) {
            break;
        }
    };
}


/**
* Helper function used to find malformed messages
* @param messages
*/
function invalidDate(messages) {

    var count = 0
    for (let m of messages) {



        var message = JSON.parse(m);

        if(message.date.indexOf('Invalid date') > -1) {
            console.log(message);
            count++;
        }


        if (count == 100) {
            break;
        }
    }

    console.log("count: " + count)
}