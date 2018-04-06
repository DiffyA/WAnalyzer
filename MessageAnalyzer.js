"use strict";

function getMediaType(message) {
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

    return type;
}

module.exports = getMediaType;
