var express = require('express');
var { mongoose } = require('./config/mongoose')
var logger = require('morgan');

var app = express();

var notificationsRoutes = require('./routes/notifications-routes');


app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, 'public')));


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.status('error');
});

app.use('/', notificationsRoutes);

module.exports = app;