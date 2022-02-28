const express = require('express');
const feedController = require('../controllers/feed');
const isAuth = require('../utils/isAuth');

const router = express.Router();

router.get('/writings', isAuth, feedController.getWritings);
router.post('/write', isAuth, feedController.createWriting);
router.get('/writings/:writingID', isAuth, feedController.getWritingsById);
router.delete('/writings/:writingID', isAuth, feedController.deletePost);
module.exports = router;
