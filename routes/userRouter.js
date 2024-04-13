const Router = require('express');
const router = new Router();
const userControler = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Роуты для регистрации, входа и проверки аутентификации
router.post('/registration', userControler.registration);
router.post('/login', userControler.login);
router.get('/auth', authMiddleware, userControler.check);

// Роуты для отправки SMS и проверки кода
router.post('/send-verification-sms', userControler.sendVerificationSMS);
router.post('/verify-code', userControler.verifyCode);

module.exports = router;
