var awssum = require('awssum-amazon-s3'),
    s3credentials = require('../credentials/amazons3.js'),
    fs = require('fs');

var s3 = new awssum.S3({
    'accessKeyId'       : s3credentials.accessKeyId,
    'secretAccessKey'   : s3credentials.secretAccessKey,
    'region'            : awssum.US_EAST_1
});

var uploader = {
    upload: function(filePath, handler) {

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
                Body            : bodyStream,
                acl             : true
            };

            // uploads to s3 and sets public
            s3.PutObjectAcl(options, function(err, data) {

                if (err) {
                    console.log('Upload error');
                    return handler({error: 'Upload error'});
                }

                console.log('\n\nUpload successful!\n\n');
                console.log(data);
                return handler(data);
            });

        });
    }
};

module.exports = uploader;
