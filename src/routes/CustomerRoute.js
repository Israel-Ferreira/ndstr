const { Router } = require('express');
const customerController = require("../controllers/CustomerController");
const authService  = require('../services/AuthService')

const router = Router();

router.post("/", customerController.post);
router.post("/authenticate", customerController.authenticate)
router.post("/refresh-token",authService.authorize,customerController.refreshToken)

module.exports = router;
