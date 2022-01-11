require('dotenv').config()

const express = require('express')
const aws = require('aws-sdk')
const multer = require('multer')
const multers3 = require('multer-s3')
const uuid = require('uuid').v4
const path = require('path')
const database = require('./models')

const app = express()

app.use(express.json())

app.get('/', (req,res) => {
    res.json('Working')
})


database.sequelize.sync().then().catch(err => {
    console.error(err)
})

// AWS CREDS
const s3 = new aws.S3({apiVersion: "latest"})

const upload = multer({
    storage: multers3({
        s3,
        bucket: 's3-uploads-project',
        metadata: (req, file, cb) => {
            cb(null, {fieldName: file.filename})
        },
        key: (req,file,cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`)
        }
    })
}) 

app.listen(process.env.PORT,() => {
    console.log(`lISTENING ON PORT ${process.env.PORT}`)
})