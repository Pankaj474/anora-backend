// Create S3 service object
const { v4 } = require('uuid');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // region: 'us-east-1',
});


exports.uploadFile = async (file) => {
    // let file = files[0];
    try {
        const myFile = file.name.split('.');
        const fileType = myFile[myFile.length - 1];
        const keyName = `${v4()}.${fileType}`;

        let uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: keyName,
            Body: file.data,
        };

        const data = await s3.upload(uploadParams).promise();
        console.log("data: ",data)
        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: keyName})

        if (data) {
            return { success: true, url: data.Location, keyName };
        }
    } catch (err) {
        console.log("S3 upload error:", err)
        return { success: false, error: err };
    }
}