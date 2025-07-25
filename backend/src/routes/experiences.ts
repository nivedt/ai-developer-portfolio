import express from 'express';
import { prisma } from '../app';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
router.get('/', async (req, res) => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        company: true,
        position: true,
        description: true,
        location: true,
        startDate: true,
        endDate: true,
        current: true,
        achievements: true,
        technologies: true,
        companyUrl: true,
        companyLogo: true,
      },
    });

    res.json({
      success: true,
      data: experiences,
    });
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      company,
      position,
      description,
      location,
      startDate,
      endDate,
      current,
      achievements,
      technologies,
      companyUrl,
      companyLogo,
    } = req.body;

    if (!company || !position || !startDate) {
      return res.status(400).json({
        success: false,
        error: 'Company, position, and start date are required',
      });
    }

    const experience = await prisma.experience.create({
      data: {
        userId: req.user!.id,
        company,
        position,
        description: description || null,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        achievements: achievements || [],
        technologies: technologies || [],
        companyUrl: companyUrl || null,
        companyLogo: companyLogo || null,
      },
    });

    res.status(201).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;