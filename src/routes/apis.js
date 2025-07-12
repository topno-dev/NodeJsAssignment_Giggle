const express = require('express')
const router = express.Router()
const multer = require('multer')
const { getVideoDurationInSeconds } = require('get-video-duration')

var moderationQue = []
var videoStorageQue = []

var fs = require('fs')
const { assert } = require('console')

// Load JSON File
var sampleChallengeJsonObject = JSON.parse(fs.readFileSync('./src/data/challenge.json'))

router.get('/challenges', (req, res) => {
    res.json(sampleChallengeJsonObject)
})

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './src/uploads')
    },
    filename: function(req, file, cb){
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const multerMemoryStorage = multer.memoryStorage()

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('video/')){
//         cb(null, true)
//     } else {
//         cb(new Error('Invalid file type, only videos are accepted'), false)
//     }
// }

const upload = multer({
    storage: multerMemoryStorage,
    limits: {
        fileSize: 50000000,
    },
    // fileFilter: fileFilter
})

router.post('/submissions', upload.single('file'), (req, res) =>{
    // const duration = getVideoDurationInSeconds(req.file.buffer)
    // getVideoDurationInSeconds(req.file.destination).then((duration) => {
    //     console.log(duration)
    // })
    console.log(req.file)
    let issues = false
    if (req.file == undefined) {
        issues = true
        res.json({"result":"Please upload a video file, no file was uploaded"})
    }

    if (!req.file.mimetype.startsWith('video/')){
        issues = true
        res.json({"result":"Please upload a video file, wrong file type was uploaded"})
    }

    videoId = moderationQue.length
    timeUploaded = `${Date.now()}`
    fileName = timeUploaded + '_' + req.file.originalname
    fileDuration = req.body.fileDuration
    fileBuffer = req.file.buffer

    if (fileDuration > 15){
        issues = true
        res.json({"result":"Failed: Video is longer than 15 seconds. Upload a file shorter than or equal to 15 seconds"})
    }

    if (issues === false){
        uploadFile = {videoId: videoId,timeUploaded:timeUploaded, fileDuration: fileDuration,fileName:fileName}
        moderationQue.push(uploadFile)
        videoStorageQue.push(fileBuffer)
        console.log(moderationQue)
        console.log(videoStorageQue)
        res.json({"result":"Submission pendind review by moderator"})
    }

})

router.get("/submissions", (req, res)=>{
    res.json(moderationQue)
})

// Optional Bonus Feature

router.post("/preview", (req, res)=>{
    res.send("Optional Bonus feature preview post")
})

module.exports = router