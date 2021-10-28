var express = require("express");
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var cors = require("cors");
const db = require('./db');
const jwt = require('./jwt');
const { User, Meeting } = require("./db");
const errorHandler = require('./error-handler');
var jimp = require('jimp');
var multer = require('multer');
var uploadDocs = multer({ dest: "/data/uploadImages" })
const userService = require('./users/users.service');
var meetingNoteModel = db.MeetingNotes;
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(jwt());
app.use(errorHandler);

app.use('/User', require('./users/users.controller'));
app.use('/Meeting', require('./meetings/meetings.controller'));
app.use('/Action', require('./actions/actions.controller'));
app.use('/Decision', require('./decisions/decisions.controller'));
app.use('/Comment', require('./comments/comments.controller'));
app.use('/Poll', require('./polls/polls.controller'));

app.post('/Profile/:id', uploadDocs.single("uploadPic"), async function (req, res, next) {
    var object = {};
    var imageSrc;


    await jimp.read("/data/uploadImages/" + req.file.filename, function (err, data) {
        if (data === null || data === undefined) {
            return res.json(err);
        } else {
            data.resize(500, 500)
                .quality(60)
                .getBase64Async(jimp.MIME_JPEG).then(test => {

                    test = test.replace('data:image/jpeg;base64,', '');

                    imageSrc = test;

                    object["profilePic"] = req.file.filename;
                    object["imageSrc"] = imageSrc;
                    userService.updateProfile(req.params.id, object).then(user => {

                        res.json(user);
                    });
                })
        }

    })
        .catch(err => {
            console.log(err);
        })
});

app.post('/attachment/:id', uploadDocs.single("uploadFile"), async function (req, res, next) {
    var id = req.params['id'];
    const meeting = await Meeting.find({ id: id })

    var file = req.file;
    console.log("file",file)

    // file.forEach(element => {
    // const user = userService.getUser(req.users.sub).then(async user => {
    const meetingNotes = new meetingNoteModel();
    meetingNotes.meetingID = id;
    // meetingNotes.username = user.username;
    meetingNotes.attachmentName = file['filename'];
    meetingNotes.originalName = file['originalname'];
    // meetingNotes.userFirstname = user.firstName;


    jimp.read(file.path, function (err, test) {
        if (test === undefined || test === null) {
            var bitmap = fs.readFileSync('assets/default_attachment_icon.png');
            meetingNotes.thumbnail = new Buffer.from(bitmap).toString('base64');
            meetingNotes.save();
            res.json({ meetingNotes });
            return;
        } else {
            test
                .getBase64Async(jimp.MIME_JPEG).then(data => {

                    data = data.replace('data:image/jpeg;base64,', '');
                    meetingNotes.thumbnail = data;
                    meetingNotes.save();
                    res.json({ meetingNotes });
                })
        }
    })
        .catch(err => {
            console.log(err);
        });
    // });

    // })

});

app.get('/download/:id', function (req, res) {

    const filepath = "/data/uploadImages/" + req.params['id'];
    jimp.read(filepath, function (err, data) {
        if (data === null || data === undefined) {
            return res.sendFile(filepath);
        } else {
            data.resize(250, 350)
                .quality(100)
                .getBase64Async(jimp.MIME_JPEG).then(test => {
                    res.sendFile(filepath);
                })
        }
    })
});

app.delete('/attachment/:id', async function (req, res, next) {

    const attachment = await meetingNoteModel.findById(req.params.id);
    const filename = attachment.attachmentName;
    fs.unlinkSync("/data/uploadImages/" + filename);
    attachment.remove();
    res.json({});
});








// const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 3000;

var server = http.listen(3000, function () {
    console.log("server started listen on 3000")
});



