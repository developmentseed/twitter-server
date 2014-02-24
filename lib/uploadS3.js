var fs = require('fs'),
    Awssum = require('awssum-amazon-s3'),
    s3credentials = require('../credentials/amazons3.js');

function UploadS3() {
    if (!(this instanceof UploadS3)) return new UploadS3();
    this.s3 = new Awssum.S3({
        'accessKeyId'       : s3credentials.accessKeyId,
        'secretAccessKey'   : s3credentials.secretAccessKey,
        'region'            : Awssum.US_EAST_1
    });
}

UploadS3.prototype.upload = function(filePath, handler) {

    var self = this;

    // s3 requires you to get file size and send in PUT request
    fs.stat(filePath, function(err, fileInfo) {

        if (err) {
            console.log('File path not found');
            return handler({error: 'File not found'});
        }

        var bodyStream = fs.createReadStream(filePath);

        var options = {
            BucketName      : 'reliefweb',
            ObjectName      : 'tweets.json',
            ContentLength   : fileInfo.size,
            Body            : bodyStream
        };

        // uploads to s3 and sets public
        self.s3.PutObject(options, function(err, data) {

            if (err) {
                console.log('Upload error');
                return handler({error: 'Upload error'});
            }

            console.log('\n\nUpload successful!\n\n');
            console.log(data);
            return handler(data);
        });
    });
};

module.exports = UploadS3;
