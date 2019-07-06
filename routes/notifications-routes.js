var express = require('express');

var router = express.Router();


var TokenManagement = require('../controller/TokenManagement')

router.post('/sendFCM', TokenManagement.sendFCM);
router.post('/ManageDevices', TokenManagement.registerDeviceIOS);
router.post('/AndroidPNServerProvider/register', TokenManagement.registerDeviceAndriod)
router.post('/AndroidPNServerProvider/update',TokenManagement.updateRegister)
router.post('/check', TokenManagement.isTokenFound)

// router.get('/getCategories',TokenManagement.getCategoryFromWebsite)

// /ManageDevices
// /AndroidPNServerProvider/register

module.exports = router
