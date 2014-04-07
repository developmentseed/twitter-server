var fs = require('fs'),
    TwitterSearch = require("./lib/twitterSearch.js"),
    S3 = require('./lib/uploadS3.js'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app);

var config = {
        query: {
            q: "ebola%20guinea%20%40who%20OR%20%40ocha%20OR%20%40msf"
        }
    },

    // Request takes a param object, which must contain either:
    // list id or
    // list slug and owner name
    // if left blank, returns default list from npr
    request = new TwitterSearch(config),

    upload = new S3(),

    // where tweets get saved
    filePath = './data/tweets.json',

    // Use 5+ second intervals or else Twitter will block you
    delay = 10;

function countdown(seconds, duration) {
    setTimeout(function() {
        console.log(seconds);
        seconds = seconds - 1;
        if (seconds === 0) {
            request.list();
        }
        else {
            countdown(seconds, duration);
        }
    }, 1000);
}

function makeRequestIn(delay) {
    console.log('\n\nMaking a GET request in ' + delay + ' seconds...');
    countdown(delay, delay, request.list);
}

// called on response from s3 push
function resetInterval(resp) {
    if (resp.error) {
        console.log(resp.error);
    }
    else {
        console.log('Successfully pushed to S3');
        makeRequestIn(delay);
    }
}


// on data, we write to file, then push to s3.
// on success, make another call to twitter.
request.on('data', function(list) {
    // console.log('\n\nLogging parsed response...');
    // console.log(list);
    console.log('# Tweets received: ' + list.length);

    fs.writeFile(filePath, JSON.stringify(list, null, 4), function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('JSON saved!');
            console.log('writing to S3 now...');

            upload.upload(filePath, resetInterval);
        }
        // end else
    });
    // end writeFile
});


// Start server
server.listen(3000)

// Make first request
makeRequestIn(1);
