"use strict";

const moment = require('moment');

function MessageAnalyzer() {}

MessageAnalyzer.prototype.getMediaType = function(message) {

    if (message === '') {
        return 'text';
    }

    try {
        var msg = JSON.parse(message);
        var type = 'text';

        if (msg['content'] !== '') {

            if (msg['content'].trim() === '<‎audio omitted>') {
                type = 'audio';
            }
            else if (msg['content'].trim() === '<‎image omitted>') {
                type = 'image'
            }
            else if (msg['content'].trim() === '<‎video omitted>') {
                type = 'video'
            }
        }
    }
    catch (e) {
        return new Error(e);
    }

    return type;
};


MessageAnalyzer.prototype.getSender = function(message) {

    try {
        var msg = JSON.parse(message);

        return msg['sender'];
    }
    catch (e) {
        return new Error(e);
    }

};

MessageAnalyzer.prototype.getDate = function(message) {

    try {
        var msg = JSON.parse(message);
        var date = moment(msg.date).format("DD-MM-YYYY");

        return date;
    }
    catch (e) {
        return new Error(e);
    }

};

module.exports = new MessageAnalyzer();
