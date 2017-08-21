const functions = require('firebase-functions');
const firebase = require('firebase-admin')
const express = require('express');
const path = require('path');
const engines = require('consolidate');

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

const app = express();
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs')
app.use(express.static(path.join(__dirname, 'client/build')));

var index = require('./server/index/');
app.use('/', index);

var users = require('./server/users');
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);
