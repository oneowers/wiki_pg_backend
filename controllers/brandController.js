const { User, Brand } = require("../models/models");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res) {
    const {
      name,
      description,
      color,
      cover_image,
      street_address,
      city,
      state,
      zip,
      sms_message,
    } = req.body;

    // Получите идентификатор пользователя из токена
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;

    // Создайте бренд и сохраните его id для пользователя
    const brand = await Brand.create({
      name,
      description,
      color,
      cover_image,
      street_address,
      city,
      state,
      zip,
      sms_message,
    });
    const user = await User.findByPk(userId);
    await user.update({ BrandId: brand.id });

    return res.json(brand);
  }

  async getAll(req, res) {
    const brands = await Brand.findAll();
    return res.json(brands);
  }
}

module.exports = new BrandController();
