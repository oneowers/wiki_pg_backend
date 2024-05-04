// orderController.js
const { Order } = require('../models/models');

class OrderController {
  async getAll(req, res) {
    try {
      const orders = await Order.findAll();
      return res.json(orders);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { scene_size_x, scene_size_y, furniture_list, user_id, brand_id } = req.body;
      const parsedFurnitureList = JSON.parse(furniture_list);
      const order = await Order.create({ scene_size_x, scene_size_y, furniture_list: parsedFurnitureList, user_id, brand_id });
      return res.json(order);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
