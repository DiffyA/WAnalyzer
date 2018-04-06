"use strict";

var assert = require('assert');
var messageAnalyzer = require("../MessageAnalyzer");

describe('MessageAnalyzer test', function() {

    it('getMediaType()', function(done) {

        var msg = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content":"How are you?"}';
        var msg_type = messageAnalyzer.getMediaType(msg);
        assert.equal(msg_type, 'text');

        msg = '';
        msg_type = messageAnalyzer.getMediaType(msg);
        assert.equal(msg_type, 'text');

        msg = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content": "<‎audio omitted>"}';
        msg_type = messageAnalyzer.getMediaType(msg);
        assert.equal(msg_type, 'audio');

        msg = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content": "<‎image omitted>"}';
        msg_type = messageAnalyzer.getMediaType(msg);
        assert.equal(msg_type, 'image');

        msg = '{"date":"2017-07-04T07:50:19+00:00","sender":"sender","content": "<‎video omitted>"}';
        msg_type = messageAnalyzer.getMediaType(msg);
        assert.equal(msg_type, 'video');

        done();
    });

    it('getSender()', function(done) {

        var msg = '{"date":"2017-07-04T07:50:19+00:00","sender":"Mike","content":"How are you?"}';
        var msg_sender = messageAnalyzer.getSender(msg);
        assert.equal(msg_sender, 'Mike');

        msg = '{"date":"2017-07-04T07:50:19+00:00","sender":"","content":"How are you?"}';
        msg_sender = messageAnalyzer.getSender(msg);
        assert.equal(msg_sender, '');

        done();
    });

    it('getDate()', function(done) {

        var msg = '{"date":"2017-07-14T07:50:19+00:00","sender":"Mike","content":"How are you?"}';
        var msg_date = messageAnalyzer.getDate(msg);

        // Date is formatted to DD-MM-YYYY
        assert.equal(msg_date, '14-07-2017');

        done();
    });


});