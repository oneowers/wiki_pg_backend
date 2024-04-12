const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')
const { put } = require('@vercel/blob');


class DeviceController {
    async create(req, res, next) {
        try{
            let {name, price, brandId, typeId, info} = req.body
            if(info){
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        descriptrion: i.descriptrion,
                        deviceId: device.id
                    })
                )
            }


            
            //FOR LOCAL
            // const {img} = req.files
            // let fileName = uuid.v4() + ".jpg"
            // img.mv(path.resolve(__dirname, '..', 'static', fileName))

            //FOR VERCEL
            const file = req.files.img;
            const fileName = `${uuid.v4()}.${file.name.split('.').pop()}`; // Генерируем уникальное имя файла
            const contentType = file.type || 'text/plain';

            

            const blob = await put(fileName, file.data, {
                contentType,
                access: 'public'
            });

            const fileUrl = blob.url;
            return JSON.stringify([file, fileName, contentType, blob])

            const device = await Device.create({ name, price, brandId, typeId, img: fileUrl });

            return res.json(device);
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
}

module.exports = new DeviceController()