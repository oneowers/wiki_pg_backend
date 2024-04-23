const Router = require('express');
const router = new Router();
const userControler = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware')


// Роуты для регистрации, входа и проверки аутентификации
router.post('/registration', userControler.registration);
router.post('/login', userControler.login);
router.get('/auth', authMiddleware, userControler.check);

// Роуты для отправки SMS и проверки кода
router.post('/send-verification-sms', userControler.sendVerificationSMS);
router.post('/verify-code', userControler.verifyCode);

router.get('/user', userControler.getUser);
router.get('/all-user', checkRole('ADMIN'), userControler.getAllUsers);


module.exports = router;
