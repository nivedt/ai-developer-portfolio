import express from 'express';
const router = express.Router();

// @desc    Handle contact form submissions
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        error: 'Please provide name, email, and message',
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid email address',
      });
      return;
    }

    // Log the contact form submission
    console.log('Contact form submission received:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    });

    // Send success response
    res.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.',
      data: {
        name,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Test contact endpoint
// @route   GET /api/contact/test
// @access  Public
router.get('/test', (req, res): void => {
  res.json({
    success: true,
    message: 'Contact routes are working!',
    timestamp: new Date().toISOString(),
  });
});

export default router;
