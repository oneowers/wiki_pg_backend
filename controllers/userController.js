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
}

module.exports = new UserControler()