// Loading Modules
var express = require('express');
var mongoose = require('mongoose');
var body_parser = require('body-parser');

// Instantiate App & Connection
var app = express();
var emptySchema = new mongoose.Schema({}, {strict: false});
var Entry = mongoose.model('Entry', emptySchema);

var location = process.env.CONNECTION;
mongoose.connect(location);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

// Static Middleware
app.use(express.static(__dirname + '/public'));
app.use('/jspsych-6', express.static(__dirname + "/jspsych-6"));
app.use(body_parser.json());

// View Location and Static HTML
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Routing
app.get('/', function (request, response) {
  response.render('verify.html');
});

app.get('/index', function (request, response) {
  response.render('index.html');
});

app.get('/repeat', function (request, response) {
  response.render('repeat.html');
});

app.post('/experiment-data', function (request, response) {
  Entry.create({
    "data": request.body
  });
  response.end();
});

// Start Server
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %d", server.address().port);
});
