var express = require("express");
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var cors = require("cors");
const db = require('./db');
const jwt = require('./jwt');
const { User } = require("./db");
const errorHandler = require('./error-handler');
var jimp = require('jimp');
var multer = require('multer');
var uploadDocs = multer({ dest: "/data/uploadImages" })
const userService = require('./users/users.service')

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

var server = http.listen(3000, function () {
    console.log("server started listen on 3000")
});



