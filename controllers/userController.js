const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')

const generateJwt = (id, phone_number, role) => {
    return jwt.sign(
        {id, phone_number, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

// Функция для генерации и хэширования кода проверки
async function generateAndHashCode() {
    // Генерация случайного числа (например, четырехзначного кода)
    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    // Хэширование кода проверки
    const hashedCode = await bcrypt.hash(verificationCode.toString(), 10); // 10 - сила хэширования
    return { code: verificationCode, hashedCode };
}

// Генерация времени истечения срока действия кода
function generateExpirationTime() {
    const expirationTime = new Date(); // Текущее время
    expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Например, код действителен в течение 10 минут
    return expirationTime;
}

// Предполагается, что у вас есть объект Sequelize 'User', представляющий модель пользователя
// Далее, предполагается, что у вас есть метод 'update' для обновления записи в базе данных

// Пример использования для сохранения информации о коде проверки в базе данных
async function saveVerificationCodeToDatabase(userId, verificationCode, hashedCode, expirationTime) {
    try {
        await User.update(
            { last_code: hashedCode, last_code_time: new Date(), code_expiration_time: expirationTime },
            { where: { id: userId } }
        );
        console.log('Код проверки успешно сохранен в базе данных.');
    } catch (error) {
        console.error('Ошибка при сохранении кода проверки в базе данных:', error);
    }
}

// Использование функций для генерации, шифрования и сохранения кода проверки
async function generateAndSaveVerificationCode(userId) {
    const { code, hashedCode } = await generateAndHashCode();
    const expirationTime = generateExpirationTime();
    await saveVerificationCodeToDatabase(userId, code, hashedCode, expirationTime);
    return code; // Возвращаем незашифрованный код для отправки по SMS
}


class UserControler {
    async registration(req, res, next) {
        const {phone_number, password, role} = req.body
        if(!phone_number || !password) {
            return next(ApiError.badRequest('Некоректный номер телефона или пароль.'))
        }
        const condidate = await User.findOne({where: {phone_number}})
        if(condidate){
            return next(ApiError.badRequest('Polzovatel- s takim nomerom uje suwestvuet.'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({phone_number, role, password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.phone_number, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {phone_number, password} = req.body
        const user = await User.findOne({where: {phone_number}})
        if(!user){
            return next(ApiError.internal('Polzovatel- s takim ne nayden.'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            return next(ApiError.internal('Ukazannyj pasrol- nevernyj.'))
        }
        const token = generateJwt(user.id, user.phone_number, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.phone_number, req.user.role)
        return res.json({token})
    }

    async sendVerificationSMS(req, res, next) {
        const { userId, phoneNumber } = req.body;
        const verificationCode = await generateAndSaveVerificationCode(userId);
        const message = `Код подтверждения: ${verificationCode}`;
        const url = 'notify.eskiz.uz/api/message/sms/send';
        
        try {
            await axios.post(url, { mobile_phone: phoneNumber, message });
            res.json({ success: true, message: 'SMS успешно отправлено.' });
        } catch (error) {
            console.error('Ошибка отправки SMS:', error);
            next(ApiError.internal('Произошла ошибка при отправке SMS.'));
        }
    }

    async verifyCode(req, res, next) {
        const { userId, code } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return next(ApiError.notFound('Пользователь не найден.'));
        }
        const isCodeValid = await bcrypt.compare(code.toString(), user.last_code);
        if (!isCodeValid) {
            return res.json({ success: false, message: 'Неверный код подтверждения.' });
        }
        const currentTime = new Date();
        if (currentTime > user.code_expiration_time) {
            return res.json({ success: false, message: 'Срок действия кода истек.' });
        }
        // Код подтверждения верен и не просрочен
        return res.json({ success: true, message: 'Код подтверждения верен.' });
    }
}

module.exports = new UserControler()