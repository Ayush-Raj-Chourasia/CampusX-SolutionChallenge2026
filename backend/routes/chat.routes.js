const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const chatController = require('../controllers/chat.controller');

router.post('/', protect, chatController.getOrCreateChat);
router.get('/user', protect, chatController.getUserChats);
router.get('/:chatId/messages', protect, chatController.getChatMessages);
router.post('/message', protect, chatController.sendMessage);

module.exports = router;
