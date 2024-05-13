const Router = require('express')
const router = new Router()
const participantController = require('../controllers/participantsController')

// Маршрут для создания нового участника
router.post('/', participantController.createParticipant)

// Маршрут для получения всех участников
router.get('/', participantController.getAllParticipants)

module.exports = router
