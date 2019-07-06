var mongoose = require('mongoose');

var New_iOS_Devices = new mongoose.Schema({
    device_id: String,
    token: String,
    os: String,
    channels: String,
    sound: String,
    enabled_categories: String,
    userId: String,
    badge: { type: Number, default: 0 },
    isPremium: String,
    isFCM: { type: Boolean },
    createDate: { type: Date, default: Date.now() },
    lastUpdateDate: Date
});


module.exports = mongoose.model('New_iOS_Devices', New_iOS_Devices, 'New_iOS_Devices');