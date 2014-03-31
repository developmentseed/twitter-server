Twitter Server
==============

A simple node.js program that pulls data from Twitter's 1.1 API and pushes the response to a cloud service.

You must register as a developer with [Twitter](https://dev.twitter.com/) before using this application.

Once you enter your credentials, you can run this application locally.

npm install; node app.js

Note: this is currently set up to push to S3. You can point it to a local directory, or modify accordingly to point it to a different cloud service.

### Dependencies

This application is developed and tested on Node.js v0.10.x. It uses [Twit](https://github.com/ttezel/twit) to exchange credentials with Twitter's API, [Express](https://github.com/visionmedia/express) for web server sauce, and communicates with S3 using the [Awssum Amazon S3 package](https://github.com/awssum/awssum-amazon-s3).

### Shout-out

This library is inspired by [@Kamicut's Seattle project](https://github.com/kamicut/seattle), which connects to the Streaming API and serves data through Websockets.
