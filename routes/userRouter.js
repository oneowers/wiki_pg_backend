const Router = require('express')
const router = new Router()
const userControler = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration',userControler.registration)
router.post('/login', userControler.login)
router.get('/auth', authMiddleware, userControler.check)

module.exports = router