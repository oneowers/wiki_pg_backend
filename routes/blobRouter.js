const Router = require('express');
const router = new Router();
const blobController = require('../controllers/blobController');

// Streams private Vercel Blob objects to the client
router.get('/', blobController.serve);

module.exports = router;

