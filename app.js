// Requirements
var fs = require('fs'),
    credentials = require("./credentials/twitter.js"),
    TwitterSearch = require("./lib/twitterSearch.js"),
    uploadS3 = require('./lib/uploadS3.js'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app);

var request = new TwitterSearch(credentials),
    seconds = 10;

console.log('Making a GET request every ' + seconds + ' seconds...');

setInterval(function() {
    // just a simple countdown
    console.log(seconds);
    seconds = seconds - 1;
    if (seconds === 0) {
        seconds = 7;
        // Request.list takes a param object, which must contain either:
        // list id or
        // list slug and owner name
        // if left blank, returns npr's list of programs
        request.list();
    }
}, 1000);


// Basic callback for data
request.on('data', function(list) {
    console.log('Logging parsed response...');
    console.log(list);
    console.log('# Tweets received: ' + list.length);

    var filePath = './data/tweets.json';

    fs.writeFile(filePath, JSON.stringify(list, null, 4), function(err) {
        if (err) {
            console.log('err');
        }
        else {
            console.log('JSON saved!');

            console.log('writing to S3 now...');

            uploadS3.upload(filePath, function(resp) {
                console.log(resp);
            });
        }
        // end else
    });
    // end writeFile
});


// Start server
server.listen(3000)
