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
        
        // Проверяем, что furniture_list является строкой
        if (typeof furniture_list !== 'string') {
            throw new Error('furniture_list should be a string');
        }
        
        // Парсим JSON строку
        const parsedFurnitureList = JSON.parse(furniture_list);

        // Создаем заказ
        const order = await Order.create({ scene_size_x, scene_size_y, furniture_list: parsedFurnitureList, user_id, brand_id });

        // Возвращаем созданный заказ
        return res.json(order);
    } catch (error) {
        // Если произошла ошибка, возвращаем статус 500 и сообщение об ошибке
        return res.status(500).json({ error: error.message });
    }
}

}

module.exports = new OrderController();
