const orderController = require('../controllers/OrderController');
const {Router} = require('express');
const authService = require("../services/AuthService");

const router = Router();

router.get("/",authService.authorize,orderController.getAll)
router.post("/",authService.authorize,orderController.post)

module.exports = router

