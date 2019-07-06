var AndroidDevices = require('../models/Android_Devices');
var DeviceDetails = require('../models/DeviceDetails');
var FCMController = require('./FCM-NotificationController');


module.exports.sendFCM = function (req, res) {
    let dateBeforeMonth = new Date();

    switch (req.body.platform) {
        case "IOS": {
            dateBeforeMonth.setDate(dateBeforeMonth.getDate() - 20);

            DeviceDetails.distinct("token", { os: "IOS", channels: { $regex: `.*${req.body.categoryId}*.` }, lastUpdateDate: { $gt: dateBeforeMonth } }).exec().then(dvs => {
                console.log("****************FCM COUNT**", dvs.length)
                if (dvs.length > 0) {
                    //let tokens = dvs.map(d => { return d.token });
                    FCMController.sendMultipleDeviceIOS(dvs, req.body);
                    DeviceDetails.updateMany({ os: "IOS", channels: { $regex: `.*${req.body.categoryId}*.` } }, { $inc: { "badge": 1 } })
                        .exec()
                        .then(r => {
                            console.log("Badge Updated IOS ", r);
                        });
                }
            });
            break;
        }
        case "ANDROID": {
            dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - 1);

            AndroidDevices.find({
                $or: [
                    { channels: { $regex: `.*${req.body.cid}*.` } },
                    { enabled_categories: { $regex: `.*${req.body.cid}*.` } }
                ], lastUpdateDate: { $gt: dateBeforeMonth }
            }).exec().then(dvs => {
                console.log('deviceAndriod Count **** ', dvs.length);
                if (dvs.length > 0) {
                    let tokens = dvs.map(d => { return d.token });
                    FCMController.sendMultipleDeviceANDRIOD(tokens, req.body);
                }
            });
            break;
        }
    }
    res.status(200).json({ status: "OK" });
}

module.exports.isTokenFound = function (req, res) {
    switch (req.body.platform) {
        case "IOS": {
            DeviceDetails.find({ token: req.body.token }).exec().then(dvs => {
                res.status(200).json({ status: "OK", result: dvs })
            });
            break;
        }
        case "ANDROID": {
            AndroidDevices.find({ token: req.body.token }).exec().then(dvs => {
                res.status(200).json({ status: "OK", result: dvs })
            });
            break;
        }
    }
}

module.exports.registerDeviceIOS = async function (req, res) {
    let token = req.body.token;
    let deviceId = req.body.deviceId;
    let newToken = req.body.newToken;
    let sound = req.body.snd || req.body.sound;
    let channels = req.body.channels;
    let userId = req.body.userId;
    let isPremium = req.body.isPremium;

    switch (req.body.operation) {
        case "register":
            registerIOSNew(deviceId, token, sound, channels)
            break;
        case "updateChannels":
            updateChannelsOrTokenOrSoundOrUserDetailsIOS(deviceId, token, channels, newToken, sound, userId, isPremium);
            break;
        case "updateToken":
            updateChannelsOrTokenOrSoundOrUserDetailsIOS(deviceId, token, channels, newToken, sound, userId, isPremium);
            break;
        case "changeSound":
            updateChannelsOrTokenOrSoundOrUserDetailsIOS(deviceId, token, channels, newToken, sound, userId, isPremium);
            break;
        case "updateUserDetails":
            updateChannelsOrTokenOrSoundOrUserDetailsIOS(deviceId, token, channels, newToken, sound, userId, isPremium);
            break;
        case "resetBadge":
            resetBadgeIOS(deviceId);
            break;
        default:
            break;
    }
    res.status(200).json({ status: "OK" });
}

//andriod
module.exports.registerDeviceAndriod = function (req, res) {
    let token = req.body.regId || req.query.regId;
    let channels = req.body.channels || req.query.channels;
    let enabledCategories = req.body.enabledCategories || req.query.enabledCategories;

    let userId = req.body.userId;
    let isPremium = req.body.isPremium;

    AndroidDevices.findOne({ token: token }).exec().then(async isFound => {
        if (isFound) {
            await AndroidDevices.findOneAndRemove({ token: token }).exec();
        }
        let newAndriodDevice = new AndroidDevices({
            device_id: token,
            token: token,
            os: "Andriod",
            channels: channels ? channels : "",
            sound: "default",
            createDate: new Date(),
            lastUpdateDate: new Date(),
            enabled_categories: enabledCategories
        });
        newAndriodDevice.save();
    });
    res.status(200).json({ status: "OK" });
}

//andriod
module.exports.updateRegister = function (req, res) {

    let token = req.body.regId;
    let relatedCategories = req.body.relatedCategories;
    let channels = req.body.channels;

    AndroidDevices.findOne({ token: token }).exec()
        .then(dv => {
            if (dv) {
                dv.token = token;
                dv.channels = channels;
                dv.enabled_categories = relatedCategories;
                dv.lastUpdateDate = new Date();
            } else {
                dv = new AndroidDevices({
                    device_id: token,
                    token: token,
                    os: "Andriod",
                    channels: channels ? channels : "",
                    sound: "default",
                    createDate: new Date(),
                    lastUpdateDate: new Date(),
                    enabled_categories: relatedCategories
                });
            }
            dv.save();
            res.status(200).json({ status: "OK" });
        }).catch(e => {
            console.log(e);
        })

}

function registerIOSNew(deviceId, token, sound, channels) {
    DeviceDetails.findOne({
        $or: [{ device_id: deviceId },
        { token: token }]
    }).exec().then(rs => {
        if (!rs) {
            let newIos = new DeviceDetails({
                device_id: deviceId,
                token: token,
                os: "IOS",
                channels: channels,
                sound: sound,
                isFCM: true
            });
            newIos.save();
        } else {
            rs.token = token;
            rs.channels = channels;
            rs.isFCM = true;
            rs.lastUpdateDate = new Date();
            rs.save()
        }
    })

}

async function updateChannelsOrTokenOrSoundOrUserDetailsIOS(deviceId, token, channels, newToken, sound, userId, isPremium) {
    let isFoundBefore = await DeviceDetails.findOne({ $or: [{ token: token }, { device_id: deviceId }] }).exec()
    if (isFoundBefore) {
        channels ? isFoundBefore.channels = channels : "";
        newToken ? isFoundBefore.token = newToken : "";
        sound ? isFoundBefore.sound = sound : "";
        userId ? isFoundBefore.userId = userId : "";
        isPremium ? isFoundBefore.isPremium = isPremium : "";
        lastUpdateDate = new Date();
        isFoundBefore.save();
    }
}

async function resetBadgeIOS(deviceId) {
    let isFoundBefore = await DeviceDetails.findOne({
        $or: [{ device_id: deviceId },
        { token: token }]
    }).exec()
    if (isFoundBefore) {
        lastUpdateDate = new Date();
        isFoundBefore.badge = 1;
        isFoundBefore.save();
    }
}
