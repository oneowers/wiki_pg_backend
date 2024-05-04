// furnitureController.js
const { Furniture } = require('../models/models');

class FurnitureController {
  async getAll(req, res) {
    try {
      const furniture = await Furniture.findAll();
      return res.json(furniture);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FurnitureController();
