const express = require('express')
const router = express.Router();

const {uploadDocument,matchDocumentAPI,getUserPastScans} = require('../Controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const reduceCredits = require('../Controllers/creditController').reduceCredits;

router.post('/upload',authMiddleware,reduceCredits,upload.single("document"),uploadDocument);
router.get('/match/:docId', authMiddleware, matchDocumentAPI);
router.get('/history', authMiddleware, getUserPastScans);




module.exports = router;
