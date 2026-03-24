const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY || 'secret_911';

module.exports = function (req, res, next){
    // 1. Обязательно пишем RETURN, чтобы код прервался
    if (req.method === "OPTIONS") {
        return next(); 
    }
    
    try {
        // 2. Проверяем, есть ли вообще заголовок (чтобы избежать краша split)
        if (!req.headers.authorization) {
            return res.status(401).json({ message: "Отсутствует заголовок Authorization" });
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Токен пустой" });
        }

        // 3. Расшифровываем токен
        const decoded = jwt.verify(token, SECRET_KEY); 
        
        // 4. Кладем расшифрованные данные (включая id пользователя) в req.user
        req.user = decoded; 
        
        next();
    } catch (e) {
        // Выводим реальную причину в консоль сервера (очень поможет при дебаге на Vercel)
        console.error("JWT Error:", e.message); 
        return res.status(401).json({ message: "Не авторизован или токен истек" });
    }
}