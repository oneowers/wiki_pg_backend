const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware') // 1. ИМПОРТИРУЕМ authMiddleware

router.post('/', checkRole('ADMIN'), deviceController.create)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)

// 2. ВСТАВЛЯЕМ authMiddleware ПЕРЕД deviceController.createComment
router.post('/create-comment', authMiddleware, deviceController.createComment)

router.get('/comments/:device_id', deviceController.getComments)

router.put('/:id', checkRole('ADMIN'), deviceController.update)
router.delete('/:id', checkRole('ADMIN'), deviceController.delete)

module.exports = router