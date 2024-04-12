const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')
const brandController = require('../controllers/brandController')

router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)

module.exports = router