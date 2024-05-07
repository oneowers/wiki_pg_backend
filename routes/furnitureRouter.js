// furnitureRouter.js
const Router = require('express');
const router = new Router();
const furnitureController = require('../controllers/furnitureController');

router.get('/', furnitureController.getAll);
router.post('/', furnitureController.create);

module.exports = router;
