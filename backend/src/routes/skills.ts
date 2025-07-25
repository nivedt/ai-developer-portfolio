import express from 'express';
import { prisma } from '../app';
// import { authenticate } from '../middleware/auth';

const router = express.Router();

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res): Promise<void> => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { proficiency: 'desc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        category: true,
        proficiency: true,
        yearsExperience: true,
        verified: true,
        icon: true,
        color: true,
        description: true,
      },
    });

    // Group skills by category
    const groupedSkills = skills.reduce((acc: any, skill) => {
      const category = skill.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        skills,
        grouped: groupedSkills,
      },
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private
router.post('/', async (req, res): Promise<void> => {
  try {
    const {
      name,
      category,
      proficiency,
      yearsExperience,
      icon,
      color,
      description,
    } = req.body;

    if (!name || !category || !proficiency) {
      res.status(400).json({
        success: false,
        error: 'Name, category, and proficiency are required',
      });
      return;
    }

    // For now, use the first user (in production, you'd use authenticated user)
    const firstUser = await prisma.user.findFirst();
    
    if (!firstUser) {
      res.status(400).json({
        success: false,
        error: 'No user found. Please register first.',
      });
      return;
    }

    const skill = await prisma.skill.create({
      data: {
        userId: firstUser.id,
        name,
        category,
        proficiency,
        yearsExperience: yearsExperience || 0,
        icon: icon || null,
        color: color || null,
        description: description || null,
      },
    });

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;