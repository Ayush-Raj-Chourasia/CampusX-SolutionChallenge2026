const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Get or Create a chat
exports.getOrCreateChat = async (req, res) => {
    try {
        const { listingId, sellerId } = req.body;
        const userId = req.user.id;

        if (!listingId || !sellerId) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check if chat exists
        let chat = await Chat.findOne({
            listing: listingId,
            participants: { $all: [userId, sellerId] }
        }).populate('participants', 'name profilePicture');

        if (!chat) {
            chat = await Chat.create({
                listing: listingId,
                participants: [userId, sellerId],
                lastMessage: 'Started a conversation',
                lastMessageTime: new Date()
            });
            chat = await chat.populate('participants', 'name profilePicture');
        }

        res.status(200).json({ success: true, data: chat });
    } catch (error) {
        console.error('Get/Create Chat Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get User's Chats
exports.getUserChats = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'name profilePicture')
            .populate('listing', 'title price images')
            .sort({ lastMessageTime: -1 });

        res.status(200).json({ success: true, data: chats });
    } catch (error) {
        console.error('Get User Chats Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get Messages for a Chat
exports.getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.find({ chatId })
            .populate('sender', 'name profilePicture') // Populate sender details
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { chatId, content, image } = req.body;
        const senderId = req.user.id;

        const message = await Message.create({
            chatId,
            sender: senderId,
            content,
            image
        });

        // Update Chat with last message
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: image ? '[Image]' : content,
            lastMessageTime: new Date()
        });

        const populatedMessage = await message.populate('sender', 'name profilePicture');

        // Emit socket event
        const io = req.app.get('io');
        const messageToEmit = {
            ...populatedMessage.toObject(),
            sender: populatedMessage.sender // Ensure populated sender is sent
        };
        console.log(`Emitting message to room ${chatId}:`, messageToEmit);
        io.to(chatId).emit('receive_message', messageToEmit);

        res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
