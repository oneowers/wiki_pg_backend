// orderRouter.js
const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAll);
router.post('/', orderController.create);

module.exports = router;
