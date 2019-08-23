import multerS3 from 'multer-s3';
import crypto from 'crypto';
import AWS from 'aws-sdk';
import { extname } from 'path';
import s3Config from './s3';

AWS.config.update(s3Config);
const s3 = new AWS.S3({});

export default {
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
