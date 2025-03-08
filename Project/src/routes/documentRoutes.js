const express = require('express')
const router = express.Router();

const {uploadDocument,matchDocument} = require('../Controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/upload',authMiddleware,upload.single("document"),uploadDocument);
router.get('/match/:docId',authMiddleware,matchDocument);

module.exports = router;
