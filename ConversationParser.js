"use strict";

const fs = require('fs');
const moment = require('moment');

/**
 * Returns an array of JSON formatted strings representing a message.
 * Example:
 *  '{"date":"2018-02-16T10:53:27+00:00","author":"Barbara Gonzalez","content":"Ya, es que sin media es sin nots de voz, fotos o videos. Lo quieres asi?"}',
 *  '{"date":"2018-02-16T10:54:28+00:00","author":"Victor De Gouveia","content":"Sip"}',
 * @param filepath
 * @returns {Array}
 */
function parseConversation(filepath, callback) {

    var array_messages = [];

    return readFile(filepath)
        .then(splitLiness)
        .then(function(lines) {

            // Process line by line
            lines.forEach(function(line) {
                var message = parseLine(line);
                array_messages.push(JSON.stringify(message));
            })

            // console.log(array_messages);
            // return array_messages;
            //

            callback(array_messages);

        })
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }

            resolve(data.toString('utf8'));
        });
    });
}

/**
 * Receives a conversation and splits the lines. Uses '\n[' as a delimiter. This reduces the chance of parsing a single message with
 * a newline as two.
 * @param input
 * @returns {string[]}
 */
function splitLiness(input) {
    return input.trim().split('\n[');
}

/**
 * Receives an array of messages
 * @param lines
 */
function parseLines(lines) {
    lines.forEach(function(line){
        parseLine(line);
    })
}

/**
 * Returns a string in JSON notation of the message
 * @param line
 */
function parseLine(line) {
    return {
        date: parseDate(line),
        sender: parseAuthor(line),
        content: parseContent(line)
    };
}

/**
 * Returns a string representation of the date in UTC time.
 * Example: 2018-02-16T10:54:30+00:00
 * @param message
 * @returns {string}
 */
function parseDate(message) {
    var date_string = message.substring(0, message.indexOf(',')).trim();
    var time_string = message.substring(message.indexOf(',') + 1, message.indexOf(']')).trim();

    var utc_time = moment("" + date_string + " " + time_string, 'DD-MM-YYYY HH:mm:ss').utc();

    var date = moment.utc(utc_time).format();

    return date;
}

/**
 * Returns the author of a message
 * @param message
 * @returns {string}
 */
function parseAuthor(message) {

    // Remove date portion from message
    var message_no_date = message.substring(message.indexOf(']') + 1)

    return message_no_date.substring(0, message_no_date.indexOf(':')).trim();

}

/**
 * Returns the content of the message
 * @param message
 * @returns {string}
 */
function parseContent(message) {

    // Find index of author
    var author = parseAuthor(message);

    // Use author token to find content
    return message.substr(message.indexOf(author) + author.length + 1).trim();
}

exports.parse = parseConversation;