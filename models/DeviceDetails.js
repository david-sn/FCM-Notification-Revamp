var mongoose = require('mongoose');

var DeviceDetails = new mongoose.Schema({
    device_id: String,
    token: String,
    os: String,
    isFCM: Boolean,
    channels: String,
    sound: String,
    enabledCategories: String,
    isPremume: String,
    userId: String,
    badge: { type: Number, default: 0 },
    registerDate: { type: Date, default: Date.now() },
    lastUpdateDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('DeviceDetails', DeviceDetails, 'DeviceDetails');
