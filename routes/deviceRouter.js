const Router = require('express')
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')
const deviceController = require('../controllers/deviceController')

router.post('/', checkRole('ADMIN'), deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.get('/new:n', deviceController.getLatestDevices)
router.post('/create-comment', checkRole('GHOST', true), deviceController.createComment)
router.get('/comments/:device_id', deviceController.getComments)

module.exports = router