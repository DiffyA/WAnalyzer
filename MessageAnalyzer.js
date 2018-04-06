"use strict";

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
}

module.exports = new MessageAnalyzer();
