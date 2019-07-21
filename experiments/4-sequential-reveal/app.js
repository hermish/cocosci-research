var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');

// SERVER
var app = express();
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

mongoose.connect(process.env.CONNECTION, {useNewUrlParser: true}); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', function callback() {
    console.log('Database Opened!');
});

var emptySchema = new mongoose.Schema({}, {strict: false});
var Entry = mongoose.model('Entry', emptySchema);

// ROUTER
app.get('/', function (request, response) {
  response.render('verify');
});

app.get('/main', function (request, response) {
  response.render('main.html');
});

app.get('/repeat', function (request, response) {
  response.render('repeat.html');
});

app.post('/experiment-data', function (request, response) {
  Entry.create({"data": request.body});
  response.end();
});

// Start Server
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %d", server.address().port);
});
