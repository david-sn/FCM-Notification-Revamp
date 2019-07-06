var fcm = require('fcm-notification');//    
var FCM = new fcm('../api-project-325434625119-firebase-adminsdk-s9y0o-7a7872ed24.json');
var NewIOSDevices = require('../models/New_iOS_Devices');
var AndroidDevices = require('../models/Android_Devices');
var DeviceDetail = require('../models/DeviceDetails');


// sendSingelDevice("cyxUfCNuHyo:APA91bGUV_ruw8GjzVPWVJExpIZyHw-qDh5jOumdDuMLVdQZzeybBXwc1bGFWW7UDvV47_7XQNxpSYn01ivzBXk23j3YIzvm7ezMg_YbD_zDU0iJPa3wVuszTH5YXa0GIhcSi-_3D_VG",{
//     "title": "hello",
//     "nid": "5cb4b0388c4253f2240d6ed3",
//     "version": "1",
//     "categoryId": "2",
//     "articleId": "506492766",
//     "collapse_key": "categoryId",
//     "sound":"default",
//     "platform": "IOS"
// })
function sendSingelDevice(deviceToken, msgBody) {
    console.log(deviceToken)
    FCM.send({
        data: msgBody,
        // notification: { title: "msgBody.title", "body: msgBody.title" },
        token: deviceToken
    }, function (err, response) {
        if (err) console.log(err);
        else console.log(response);
    });
}

function sendSingleDeviceIOS(deviceInfo, msgBody) {
    for (let index = 0; index < deviceInfo.length; index++) {
        var deviceDetail = deviceInfo[index];
        FCM.send({
            notification: {
                title: msgBody.title,
                body: msgBody.body,
                // message: msgBody.body
            },
            apns: {
                payload: {
                    nid: msgBody.nid,
                    version: msgBody.version,
                    aps: {
                        badge: parseInt(deviceDetail.badge || 1),
                        sound: deviceDetail.sound || "default"
                    },
                }
            },
            token: deviceDetail.token
        }, function (err, response) {
            if (err) console.log(err);
            else {
                console.log("end Send callback FCM", response)
            }
        });
    }
}


function sendMultipleDeviceANDRIOD(deviceTokens, msgBody) {
    var arrays = [];

    while (deviceTokens.length > 0)
        arrays.push(deviceTokens.splice(0, 600));

    for (let index = 0; index < arrays.length; index++) {
        const element = arrays[index];
        FCM.sendToMultipleToken({ data: msgBody }, element, function (err, response) {
            if (err) console.log("ANDRIOD ",err);
            else {
                console.log("end Send callback FCM****ANDRIOD ", response.length, " Example response ", response[5].response);
            }
        });
    }
}


/*sendMultipleDeviceIOS([
    "e1LxTUUwjnE:APA91bEB0u3EcxPv0aneDC0g_pwdxQOuF8SfXOlE6tq0Zq0ZoFH6g6cWbkjAbCEzXDaWUYa7Ja8W_cFra-rA8ZZsuifAAaE-h6k_Tc0R7AQRGs9nmLYCbq1IHspqvw31cLvTkpHOzz4E"], {
        "title": "hello",
        "nid": "5cb4b0388c4253f2240d6ed3",
        "version": "1",
        "categoryId": "2",
        "articleId": "506492766",
        "collapse_key": "categoryId",
        "sound": "default",
        "platform": "IOS"
    })*/
function sendMultipleDeviceIOS(deviceTokens, msgBody) {
    var arrays = [];

    while (deviceTokens.length > 0)
        arrays.push(deviceTokens.splice(0, 800));

    for (let index = 0; index < arrays.length; index++) {
        const element = arrays[index];
        FCM.sendToMultipleToken(
            {
                notification: {
                    title: msgBody.title,
                    //body: msgBody.body,
                    // message: msgBody.body
                },
                apns: {
                    payload: {
                        nid: msgBody.nid,
                        version: "1",
                        aps: {
                            badge: 1,
                            sound: "default"
                        },
                    }
                }
            }
            , element, function (err, response) {
                if (err) console.log("IOS** ",err);
                else {
                    console.log("end Send callback FCM****IOS ", response.length, " Example response ", response[0]);
                }
            });
    }
}


module.exports = {
    sendSingleDeviceIOS,
    sendMultipleDeviceANDRIOD,
    sendMultipleDeviceIOS
}

