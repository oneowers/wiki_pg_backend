const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')
const { put } = require('@vercel/blob');


class DeviceController {
    async create(req, res, next) {
        try{
            let {name, price, brandId, typeId, info} = req.body

            //FOR LOCAL
            // const {img} = req.files
            // let fileName = uuid.v4() + ".jpg"
            // img.mv(path.resolve(__dirname, '..', 'static', fileName))

            //FOR VERCEL
            const file = req.files.img;
            const fileName = `${uuid.v4()}.${file.name.split('.').pop()}`; // Генерируем уникальное имя файла
            const contentType = file.mimetype || 'text/plain';
            const blob = await put(fileName, file.data, {
                contentType,
                access: 'public'
            });
            const fileUrl = blob.url;

            const device = await Device.create({ name, price, brandId, typeId, img: fileUrl,  views:  0, comments: "[]"});

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

            // if (comment) {
            //     comment = JSON.parse(comment);
            //     comment.forEach(i =>
            //         DeviceComment.create({
            //             user_id: i.user_id,
            //             text: i.text
            //         })
            //     );
            // }


            return res.json({"file": file, "fileName": fileName, "contentType": contentType, "blob": blob, "device": device})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if(!brandId && !typeId){
            devices = await Device.findAndCountAll({limit, offset})
        }
        if(brandId && !typeId){
            devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
        }
        if(!brandId && typeId){
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        if(brandId && typeId){
            devices = await Device.findAndCountAll({where:{brandId, typeId}, limit, offset})
        }
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        )
        return res.json(device)
    }

    async getLatestDevices(req, res) {
        const { n } = req.params; // Получаем количество устройств из параметров запроса
        const latestDevices = await Device.findAll({
            limit: n, // Указываем количество устройств, которые нужно получить
            order: [['createdAt', 'DESC']], // Сортируем устройства по дате создания в убывающем порядке (чтобы получить последние)
            include: [{ model: DeviceInfo, as: 'info' }] // Включаем информацию об устройствах
        });
        return res.json(latestDevices);
    }

    async createComment(req, res, next) {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY) 
        try {
            const { device_id, text } = req.body;
            
            // Create the comment in the database
            const comment = await Comment.create({ user_id: decoded.id, device_id, text });
    
            return res.json(comment);
        } catch (e) {
            next(ApiError.badRequest(e.message));
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

    
    
}

module.exports = new DeviceController()