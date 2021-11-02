var aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../Config');

const bucketName = "<bucket_name>";
const region = "us-east-2";

awsAccessKey = config.awsAccessKey;
awsSecretKey = config.awsSecretKey;

const s3 = new aws.S3({
  region,
  awsAccessKey,
  awsSecretKey,
});

const isImage = (req,file,callbck)=>{
    if(file.mimetype.startsWith('image')){
      callbck(null,true)
    }else{
        callbck(new Error('Only Image is allowed'))
    }
}

var upload = multer({
    fileFilter : isImage,
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: 'testing'});
      },
      key: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const imagePath = req.params.entity + "/" + Date.now().toString() + "." + ext;
        cb(null, imagePath);
      }
    })
  })
  
  exports.upload = upload;
