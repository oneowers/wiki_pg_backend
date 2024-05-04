// furnitureRouter.js
const Router = require('express');
const router = new Router();
const furnitureController = require('../controllers/furnitureController');

router.get('/', furnitureController.getAll);

module.exports = router;
