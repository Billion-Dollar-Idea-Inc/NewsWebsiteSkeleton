var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
var newsdb = mongojs('news', ['news']);
var opiniondb = mongojs('opinion', ['opinion']);
var releasedb = mongojs('release', ['release']);
var sportsdb = mongojs('sports', ['sports']);

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public'));

app.use('/', routes);

//Angular database directives
app.get('/news', function(req, res) {
  newsdb.news.campusNews.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/news', function (req, res) {
    console.log(req.body);
    newsdb.news.campusNews.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/news/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  newsdb.news.campusNews.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

app.get('/news/:id', function(req, res) {
  var id = req.params.id;
  console.log(id);
  newsdb.news.campusNews.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
    res.json(doc);
  });
});

app.put('/news/:id', function(req, res) {
  var id = req.params.id;
  console.log(req.body.title);
  newsdb.news.campusNews.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {$set: {title: req.body.title, description: req.body.description, image: req.body.image, body: req.body.body}},
    new: true}, function (err, doc) {
      res.json(doc);
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
