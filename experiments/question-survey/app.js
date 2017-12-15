// --- LOADING MODULES
var express = require('express'),
    mongoose = require('mongoose'),
    body_parser = require('body-parser');

// --- INSTANTIATE THE APP
var app = express();
var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

var location = process.env.CONNECTION;
mongoose.connect(location);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

// --- STATIC MIDDLEWARE 
app.use(express.static(__dirname + '/public'));
app.use('/jsPsych', express.static(__dirname + "/jsPsych"));
app.use(body_parser.json());

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING
app.get('/', function(request, response) {
    response.render('index.html');
});

app.post('/experiment-data', function (request, response) {
    Entry.create({
        "data": request.body
    });    
    response.end();
});

// --- START THE SERVER 
var server = app.listen(process.env.PORT, function () {
    console.log("Listening on port %d", server.address().port);
});
