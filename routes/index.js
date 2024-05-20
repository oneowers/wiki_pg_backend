const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const furnitureRouter = require('./furnitureRouter')
const orderRouter = require('./orderRouter')
const participantRouter = require('./participantRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/furniture', furnitureRouter)
router.use('/participant', participantRouter)
router.use('/order', orderRouter)

module.exports = router