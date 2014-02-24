var fs = require('fs'),
    _ = require('underscore'),
    Awssum = require('awssum-amazon-s3'),
    s3credentials = require('../credentials/amazons3.js');

function UploadS3() {
    if (!(this instanceof UploadS3)) return new UploadS3();
    this.s3 = new Awssum.S3({
        'accessKeyId'       : s3credentials.accessKeyId,
        'secretAccessKey'   : s3credentials.secretAccessKey,
        'region'            : Awssum.US_EAST_1
    });

    this.options = {
        BucketName      : 'reliefweb',
        ObjectName      : 'tweets.json'
    };

}

UploadS3.prototype.upload = function(filePath, handler) {

    var self = this;

    // s3 requires you to get file size and send in PUT request
    fs.stat(filePath, function(err, fileInfo) {

        if (err) {
            return handler({error: 'File not found'});
        }

        var bodyStream = fs.createReadStream(filePath);

        _.extend(self.options, {
            ContentLength   : fileInfo.size,
            Body            : bodyStream,
            acl             : 'public-read'
        });

        // uploads to s3 and sets public
        self.s3.PutObject(self.options, function(err, data) {

            if (err) {
                return handler({error: 'Upload error'});
            }
            return handler(data);
        });
    });
};

module.exports = UploadS3;
