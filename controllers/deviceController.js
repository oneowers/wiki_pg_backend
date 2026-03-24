const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo, Comment } = require('../models/models')
const ApiError = require('../error/ApiError')
const { put } = require('@vercel/blob');
const jwt = require('jsonwebtoken');



class DeviceController {
    async create(req, res, next) {
        try {
            let { name, brandId, typeId, info, description } = req.body;

            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const ownerId = decoded.id;

            //FOR LOCAL
            // const {img} = req.files;
            // let fileName = uuid.v4() + "." + img.name.split('.').pop();
            // img.mv(path.resolve(__dirname, '..', 'static', fileName));

            //FOR VERCEL
            const file = req.files?.img;
            if (!file) {
                return next(ApiError.badRequest('Изображение обязательно для заполнения!'));
            }
            const fileName = `${uuid.v4()}.${file.name.split('.').pop()}`; // Generate a unique file name
            const contentType = file.mimetype || 'text/plain';
            const blob = await put(fileName, file.data, {
                contentType,
                access: 'public'
            });
            const fileUrl = blob.url;

            // Create the device with owner_id
            const device = await Device.create({ name, brandId, typeId, img: fileUrl, views: 0, device_comments: "[]", owner_id: ownerId, description });
            if (info) {
                info = JSON.parse(info);
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                );
            }
            return res.json({ device });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }


    async getAll(req, res) {
        let { brandId, typeId, limit, page, sortBy } = req.query;
        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;
        let devices;

        const queryOptions = {
            limit,
            offset
        };

        if (sortBy === 'createdAt' || sortBy === 'views') {
            queryOptions.order = [[sortBy, 'DESC']];
        } else {
            // Если параметр sortBy не указан или имеет недопустимое значение,
            // сортировать по дате создания
            sortBy = 'createdAt';
            queryOptions.order = [['createdAt', 'DESC']];
        }

        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll(queryOptions);
        } else if (brandId && !typeId) {
            devices = await Device.findAndCountAll({ ...queryOptions, where: { brandId } });
        } else if (!brandId && typeId) {
            devices = await Device.findAndCountAll({ ...queryOptions, where: { typeId } });
        } else if (brandId && typeId) {
            devices = await Device.findAndCountAll({ ...queryOptions, where: { brandId, typeId } });
        }

        return res.json(devices);
    }





    async getOne(req, res) {
        try {
            const { id } = req.params;

            // Find the device by its ID
            const device = await Device.findOne({
                where: { id },
                include: [{ model: DeviceInfo, as: 'info' }]
            });

            if (!device) {
                // If device is not found, return an error response
                return res.status(404).json({ message: 'Device not found' });
            }

            // Increment the view count of the device
            device.views++; // Increment the view count

            // Save the updated device to the database
            await device.save();

            return res.json(device);
        } catch (error) {
            // Handle errors
            console.error('Error fetching device:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    async createComment(req, res, next) {
        try {
            const { device_id, text } = req.body;
            const userId = req.user.id;

            const comment = await Comment.create({
                device_id: device_id,
                user_id: userId, // <-- ИСПРАВЛЕНО: теперь точно совпадает с базой данных
                text: text
            });

            return res.json(comment);
        } catch (e) {
            return res.status(400).json({ message: e.message });
        }
    }

    async getComments(req, res, next) {
        try {
            const { device_id } = req.params;

            // Retrieve all comments associated with the specified device
            const comments = await Comment.findAll({ where: { device_id } });

            return res.json(comments);
        } catch (e) {
            next(ApiError.internalServerError(e.message));
        }
    }




async update(req, res, next) {
        try {
            const { id } = req.params;
            // Добавили img сюда, чтобы ловить текстовый URL с фронтенда
            let { name, brandId, typeId, info, description, img } = req.body;

            const device = await Device.findByPk(id);
            if (!device) {
                return res.status(404).json({ message: 'Device not found' });
            }

            // Update simple fields
            if (name) device.name = name;
            if (brandId) device.brandId = brandId;
            if (typeId) device.typeId = typeId;
            if (description !== undefined) device.description = description;

            // --- ГИБКАЯ ОБРАБОТКА КАРТИНКИ ---
            const file = req.files?.img;
            
            if (file) {
                // 1. Если пришел реальный файл (задел под Vercel Blob)
                const fileName = `${uuid.v4()}.${file.name.split('.').pop()}`;
                const contentType = file.mimetype || 'text/plain';
                const blob = await put(fileName, file.data, {
                    contentType,
                    access: 'public'
                });
                device.img = blob.url; // Сохраняем сгенерированный URL от Vercel
            } else if (img && typeof img === 'string') {
                // 2. Если файла нет, но пользователь передал прямую ссылку (строку)
                device.img = img;
            }

            await device.save();

            // Handle info updates
            if (info) {
                info = JSON.parse(info);
                // First delete old info
                await DeviceInfo.destroy({ where: { deviceId: id } });
                // Then create new info
                // Используем Promise.all для корректного ожидания всех асинхронных операций
                await Promise.all(
                    info.map(i =>
                        DeviceInfo.create({
                            title: i.title,
                            description: i.description,
                            deviceId: id
                        })
                    )
                );
            }

            return res.json({ device });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const device = await Device.findByPk(id);
            if (!device) {
                return res.status(404).json({ message: 'Device not found' });
            }

            await DeviceInfo.destroy({ where: { deviceId: id } });
            await Comment.destroy({ where: { device_id: id } });
            await device.destroy();

            return res.json({ message: 'Device deleted successfully' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new DeviceController()