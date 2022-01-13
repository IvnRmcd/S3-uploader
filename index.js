require('dotenv').config()

const express = require('express')
const multer = require('multer')
const uuid = require('uuid').v4
const fs = require('fs')
const database = require('./models')
const path = require('path')
const { S3 } = require('aws-sdk')


const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null, 'uploads/')
    },
    filename:function(req,file,cb) {
        cb(null, file.originalname)
    }
})

// file Filter options must be defined outside the storage object
const uploadFilter =  function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/gif') {
         req.fileValidationError = "Forbidden extension";
         return cb(null, false, req.fileValidationError);
   } 
   cb(null, true);
}


const upload = multer({storage,fileFilter:uploadFilter})


const app = express()

app.use(express.json())


database.sequelize.sync().then().catch(err => {
    console.error(err)
})


const region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey  = process.env.AWS_SECRET_KEY
const bucketName = process.env.AWS_BUCKET_NAME

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  })
  

const fileUpload = (file) => {
    const fileStream = fs.createReadStream(file.path)

        const uploadParams = {
            Bucket: bucketName, 
            Body: fileStream, 
            Key: `${file.originalname}`
        }
        return s3.upload(uploadParams).promise()
}

app.use(express.static('public'))


app.post('/upload', upload.single('appImage') ,async(req,res) => {
    if (req.fileValidationError) {
        console.log(req.fileValidationError)
        return
   } else if (!req.file) {
       return res.status(400).json({message: `No File Selected`})
   }
   await fileUpload(req.file).then(
       file => {return res.status(200).json({message: file})})
       .catch(err => {return res.status(400).json({message: err.message})})
})

app.listen(process.env.PORT,() => {
    console.log(`lISTENING ON PORT ${process.env.PORT}`)
})

