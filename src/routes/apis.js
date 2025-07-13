const express = require('express')
const router = express.Router()
const multer = require('multer')
const { getVideoDurationInSeconds } = require('get-video-duration')

const moderationStatuses = ['pending','approved','rejected']
var moderationQue = []
// var videoStorageQue = []
var uniqueName = ""

var fs = require('fs')
const { assert } = require('console')
const path = require('path')

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
        uniqueName = `${Date.now()}_${file.originalname}`
        return cb(null, uniqueName)
    }
})

// Can store in memory
const multerMemoryStorage = multer.memoryStorage()

/*

File Filter to use if we want a particular type of file, not implemented here

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')){
        cb(null, true)
    } else {
        cb(new Error('Invalid file type, only videos are accepted'), false)
    }
}
*/
const upload = multer({
    storage: multerMemoryStorage,
    limits: {
        fileSize: 50000000,
    },
    // fileFilter: fileFilter
})

const uploadDisk = multer({
    storage: multerStorage,
    limits: {
        fileSize: 50000000,
    },
    // fileFilter: fileFilter
})

/*
We are sending a fileDuration as a key on the request as we are simulating the 
file duration. We will assume that the file duration is being calculated from
the client.
*/ 

post_middleware = {
    file_uploader : uploadDisk.single('file'),
    delay_middleware : function(req, res, next){
        setTimeout(() => {
            console.log("Delaying as per requirements, delay for 2 seconds.")
            next()
        }, 2000)
    }
}

router.post('/submissions', [post_middleware.delay_middleware, post_middleware.file_uploader], (req, res) =>{
    let issues = false
    maximumTime = 15 // Seconds
    if (req.file == undefined) {
        issues = true
        return res.json({"result":"Please upload a video file, no file was uploaded"})
    }

    if (!req.file.mimetype === 'video/mp4' || !req.file.mimetype === 'application/mp4'){
        issues = true
        console.log(req.file.mimetype)
        return res.json({"result":"Please upload a video file, wrong file type was uploaded"})
    }

    videoId = moderationQue.length
    timeUploaded = `${Date.now()}`
    // fileName = timeUploaded + '_' + req.file.originalname
    fileName = uniqueName
    fileDuration = req.body.fileDuration
    // Only to use when using memory storage using multer
    //fileBuffer = req.file.buffer
    stickerArray = req.body.stickers
    moderationStatus = moderationStatuses[Math.floor(Math.random() * moderationStatuses.length)]
    stickers = []

    // If stickers exist, push stickers into stickers array, we have this due to /challenges having stickers
    if (stickerArray != undefined){
        for (const char of stickerArray){
            stickers.push(char)
        }
    }

    if (fileDuration > maximumTime){
        issues = true
        return res.json({"result":"Failed: Video is longer than 15 seconds. Upload a file shorter than or equal to 15 seconds"})
    }

    if (issues === false){
        uploadFile = {videoId: videoId,timeUploaded:timeUploaded, fileDuration: fileDuration,fileName:fileName, stickers: stickers, moderationStatus: moderationStatus}
        moderationQue.push(uploadFile)
        // videoStorageQue.push(fileBuffer)
        return res.json({"result":"Submission pendind review by moderator"})
    }

})

router.get("/submissions", (req, res)=>{
    res.json(moderationQue)
})

// Optional Bonus Feature

previewUploader = multer({storage: multerStorage})

router.post("/preview",previewUploader.single('file'),(req, res)=>{
    if (!req.file) {
        return res.status(400).json({ result: "No video uploaded" })
    }

    const videoPath = '/uploads/' + req.file.filename
    const fileName = req.file.originalname 
    console.log(fileName, req.file)

    const fullPath = path.resolve(__dirname, '..', 'uploads', fileName)
    console.log(fullPath)
    res.render('preview', {
        videoPath: videoPath,
        fileName: fileName,
        originalName: req.file.originalname,
        fullPath: fullPath
    })
})

module.exports = router