const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Basket} = require('../models/models')
const axios = require('axios');

const generateJwt = (id, phone_number, role) => {
    return jwt.sign(
        {id, phone_number, role}, 
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

async function generateAndHashCode() {
    // Генерация случайного числа (например, четырехзначного кода)
    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    // Хэширование кода проверки
    const hashedCode = await bcrypt.hash(verificationCode.toString(), 5); // 10 - сила хэширования
    return { code: verificationCode, hashedCode };
}

function generateExpirationTime() {
    const expirationTime = new Date(); // Текущее время
    expirationTime.setMinutes(expirationTime.getMinutes() + 2); // Например, код действителен в течение 10 минут
    return expirationTime;
}

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

async function generateAndSaveVerificationCode(userId) {
    // Генерация и хэширование кода проверки
    const { code, hashedCode } = await generateAndHashCode();
    const expirationTime = generateExpirationTime();
    await saveVerificationCodeToDatabase(userId, code, hashedCode, expirationTime);
    return { code, expirationTime }; // Возвращаем код и время истечения срока действия для проверки
}


class UserControler {
    async registration(req, res, next) {
        const {phone_number, password, role} = req.body
        if(!phone_number || !password) {
            return next(ApiError.badRequest('Некоректный номер телефона или пароль.'))
        }
        const condidate = await User.findOne({where: {phone_number}})
        if(condidate){
            return next(ApiError.badRequest('Пользователь c этим номером уже связан.'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({phone_number, role: 'GHOST', password: hashPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.phone_number, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {phone_number, password} = req.body
        const user = await User.findOne({where: {phone_number}})
        if(!user){
            return next(ApiError.internal('Пользователь c таким не найден.'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword) {
            return next(ApiError.internal('Указанный пароль неверный.'))
        }
        const token = generateJwt(user.id, user.phone_number, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const {id} = req.user
        const user = await User.findOne({where: {id}})
        if(!user){
            return next(ApiError.internal('Пользователь c таким не найден.'))
        }
        const token = generateJwt(user.id, user.phone_number, user.role)
        return res.json({token})
    }

    async sendVerificationSMS(req, res, next) {
        const { phoneNumber } = req.body;
        
        try {
            const user = await User.findOne({ where: { phone_number: phoneNumber } });
            if (!user) {
                return res.status(404).json({ success: false, message: 'Пользователь с таким номером телефона не найден.' });
            }
            
            // Проверяем, не истек ли срок действия текущего кода
            const currentTime = new Date();
            if (user.code_expiration_time && currentTime < user.code_expiration_time) {
                return res.status(400).json({ success: false, message: 'Срок действия текущего кода подтверждения ещё не истёк.' });
            }
            
            // Генерируем и сохраняем новый код подтверждения
            const verificationCode = await generateAndSaveVerificationCode(user.id);
            const message = `Код подтверждения: ${verificationCode.code}`;
            const url = "http://notify.eskiz.uz/api/message/sms/send";
            const sms_token = process.env.SMS_TOKEN;
    
            await axios.post(url, { "mobile_phone": phoneNumber, "message": message, from: "4546"}, {
                headers: {
                    Authorization: sms_token // Добавляем токен в заголовок запроса
                }
            });
            
            res.json({ verificationCode, success: true, message: 'SMS успешно отправлено.' });
        } catch (error) {
            console.error('Ошибка отправки SMS:', error);
            next(ApiError.internal('Произошла ошибка при отправке SMS.'));
        }
    }

    async verifyCode(req, res, next) {
        const { phoneNumber, code } = req.body;
        const user = await User.findOne({ where: { phone_number: phoneNumber } });
        if (!user) {
            return res.json({ success: false, message: 'Пользователь с таким номером телефона не найден.' });
        }

        
        const currentTime = new Date();
        if (currentTime > user.code_expiration_time) {
            return res.json({ success: false, message: 'Срок действия кода истек.' });
        }

        const isCodeValid = await bcrypt.compare(code.toString(), user.last_code);
        if (!isCodeValid) {
            return res.json({ success: false, message: 'Неверный код подтверждения.' });
        }

        // Код подтверждения верен и не просрочен
        // Меняем роль пользователя на "USER"
        try {
            if(user.role != "ADMIN") await user.update({ role: 'USER' });
            const token = generateJwt(user.id, user.phone_number, 'USER')
            return res.json({ token: token, success: true, message: 'Код подтверждения верен. Роль пользователя изменена на "USER".' });
        } catch (error) {
            console.error('Ошибка при изменении роли пользователя:', error);
            return res.json({ success: false, message: 'Произошла ошибка при изменении роли пользователя.' });
        }
    }
    
    async getUser(req, res, next) {
        
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            return res.json({ success: true, user: user });
        } catch (error) {
            console.error('Error while fetching user:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }

    async getAllUsers(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'last_name', 'first_name', 'phone_number', 'BrandId'],
            });

            return res.json({ success: true, users: users });
        } catch (error) {
            console.error('Error while fetching users:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error.' });
        }
    }
}

module.exports = new UserControler()