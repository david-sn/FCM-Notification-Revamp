var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true)
// mongoose.set('debug', true);
// mongoose.connect('mongodb://localhost:27017/next', { useNewUrlParser: true }, function (err) {
mongoose.connect('mongodb://localhost:2807/local', { useNewUrlParser: true }, function (err) {
    if (err) return console.error(err);
    console.log('connection successed to mongoDb>>> fcm-drwaza-notification');
});
module.exports = { mongoose };
