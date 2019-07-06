var mongoose = require('mongoose');

var iOS_Devices = new mongoose.Schema({
    device_id: String,
    token: String,
    os: String,
    channels: String,
    sound: String,
    enabled_categories: String
});
 
module.exports = mongoose.model('iOS_Devices', iOS_Devices, 'iOS_Devices');
