"use strict";

var assert = require('assert');
var messageAnalyzer = require("../MessageAnalyzer");

describe('MessageAnalyzer tests', function() {

    it('getMediaType()', function(done) {

        var msg_content = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content":"How are you?"}';
        var msg_type = messageAnalyzer.getMediaType(msg_content);
        assert.equal(msg_type, 'text');

        msg_content = '';
        msg_type = messageAnalyzer.getMediaType(msg_content);
        assert.equal(msg_type, 'text');

        msg_content = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content": "<‎audio omitted>"}';
        msg_type = messageAnalyzer.getMediaType(msg_content);
        assert.equal(msg_type, 'audio');

        msg_content = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content": "<‎image omitted>"}';
        msg_type = messageAnalyzer.getMediaType(msg_content);
        assert.equal(msg_type, 'image');

        msg_content = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content": "<‎video omitted>"}';
        msg_type = messageAnalyzer.getMediaType(msg_content);
        assert.equal(msg_type, 'video');

        done();
    });


});