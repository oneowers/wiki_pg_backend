const { User, Brand } = require("../models/models");
const jwt = require("jsonwebtoken");




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


// class FornitureController {
//   async create(req, res) {
//     const {
//       name,
//       img,
//       unit_of_measure,
//       price,
//     } = req.body;

//     // Получите идентификатор пользователя из токена
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     const userId = decoded.id;

//     // Создайте бренд и сохраните его id для пользователя
//     const forniture = await Forniture.create({
//       name,
//       img,
//       unit_of_measure,
//       price,
//     });
//     const user = await User.findByPk(userId);
//     await user.update({ FornitureId: forniture.id });

//     return res.json(forniture);
//   }

//   async getAll(req, res) {
//     const fornitures = await Forniture.findAll();
//     return res.json(fornitures);
//   }
// }

// module.exports = new FornitureController();
module.exports = new BrandController();
