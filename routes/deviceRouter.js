const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.post('/create-comment', deviceController.createComment)
router.get('/comments/:device_id', deviceController.getComments)

// --- ADD THE TWO CRUD ROUTES BELOW ---
router.put('/:id', checkRole('ADMIN'), deviceController.update)
router.delete('/:id', checkRole('ADMIN'), deviceController.delete)

module.exports = router