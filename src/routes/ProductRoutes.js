const {Router} = require('express')
const productController = require('../controllers/ProductController')
const authService = require('../services/AuthService');

const router= Router();


router.get("/", productController.getAll);

router.get("/:slug",productController.getBySlug)

router.get("/admin/:id",authService.isAdmin, productController.getById)

router.get("/tags/:tag",productController.getByTag)

router.post("/",authService.isAdmin,productController.post);

router.put("/:id", authService.isAdmin,productController.put);

router.delete("/:id", authService.isAdmin,productController.delete);

module.exports = router