// import express from 'express';
// import { prisma } from '../app';
// import { authenticate, optionalAuth } from '../middleware/auth';

// const router = express.Router();

// // @desc    Send contact message
// // @route   POST /api/messages
// // @access  Public
// router.post('/', optionalAuth, async (req, res) => {
//   try {
//     const { name, email, subject, message, phone, company } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).json({
//         success: false,
//         error: 'Name, email, and message are required',
//       });
//     }

//     const contactMessage = await prisma.message.create({
//       data: {
//         userId: req.user?.id || null,
//         name,
//         email,
//         subject: subject || null,
//         message,
//         phone: phone || null,
//         company: company || null,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         subject: true,
//         message: true,
//         createdAt: true,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       data: contactMessage,
//       message: 'Message sent successfully',
//     });
//   } catch (error) {
//     console.error('Send message error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// // @desc    Get all messages (admin only)
// // @route   GET /api/messages
// // @access  Private
// router.get('/', authenticate, async (req, res) => {
//   try {
//     const messages = await prisma.message.findMany({
//       orderBy: { createdAt: 'desc' },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         subject: true,
//         message: true,
//         phone: true,
//         company: true,
//         isRead: true,
//         replied: true,
//         createdAt: true,
//       },
//     });

//     res.json({
//       success: true,
//       data: messages,
//     });
//   } catch (error) {
//     console.error('Get messages error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// export default router;