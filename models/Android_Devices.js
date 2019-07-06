var mongoose = require('mongoose');

var Android_Devices = new mongoose.Schema({
    device_id: String,
    token: String,
    os: String,
    channels: String,
    sound: String,
    enabled_categories: String,
    createDate: Date,
    lastUpdateDate: Date
});

module.exports = mongoose.model('Android_Devices', Android_Devices, 'Android_Devices');
