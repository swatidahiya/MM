var express = require("express");
var app = express();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var cors = require("cors");
const db = require('./db');
const jwt = require('./jwt');
const { User } = require("./db");
const errorHandler = require('./error-handler');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());
app.use(errorHandler);

app.use('/User', require('./users/users.controller'));
app.use('/Meeting', require('./meetings/meetings.controller'));

var server = http.listen(3000, function () {
    console.log("server started listen on 3000")
});



