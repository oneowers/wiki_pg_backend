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

  async create(req, res) {
    try {
      const { name, type, price, rating, img, description, owner_id } = req.body;
      const newFurniture = await Furniture.create({
        name,
        type,
        price,
        rating,
        img,
        description,
        owner_id
      });
      return res.status(201).json(newFurniture); // Return 201 for successful creation
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FurnitureController();
