const {Brand} = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
    async create(req, res) {
        const {name, description, color} = req.body
        const brand = await Brand.create({name, description, color})
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }
}

module.exports = new BrandController()