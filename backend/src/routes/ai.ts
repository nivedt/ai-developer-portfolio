import express from 'express';
import { prisma } from '../app';
import { AIService } from '../services/openai';

const router = express.Router();

// @desc    Generate enhanced project description
// @route   POST /api/ai/enhance-project
// @access  Public
router.post('/enhance-project', async (req, res): Promise<void> => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      res.status(400).json({
        success: false,
        error: 'Project ID is required',
      });
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      res.status(404).json({
        success: false,
        error: 'Project not found',
      });
      return;
    }

    const enhancedDescription = await AIService.generateProjectDescription({
      title: project.title,
      description: project.description || '',
      techStack: project.techStack,
      category: project.category || undefined,
    });

    // Update project with AI-generated description
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { aiDescription: enhancedDescription },
    });

    res.json({
      success: true,
      data: {
        originalDescription: project.description,
        aiDescription: enhancedDescription,
        project: updatedProject,
      },
    });
  } catch (error) {
    console.error('Enhance project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Generate enhanced bio
// @route   POST /api/ai/enhance-bio
// @access  Public
router.post('/enhance-bio', async (req, res): Promise<void> => {
  try {
    const user = await prisma.user.findFirst({
      include: {
        skills: true,
        projects: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const enhancedBio = await AIService.generatePersonalizedBio({
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title || 'Software Developer',
      bio: user.bio || '',
      skills: user.skills.map(skill => skill.name),
      projects: user.projects.map(project => ({
        title: project.title,
        description: project.description || '',
        techStack: project.techStack,
        category: project.category || undefined,
      })),
    });

    res.json({
      success: true,
      data: {
        originalBio: user.bio,
        enhancedBio,
      },
    });
  } catch (error) {
    console.error('Enhance bio error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Chat with AI assistant
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', async (req, res): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({
        success: false,
        error: 'Message is required',
      });
      return;
    }

    const user = await prisma.user.findFirst({
      include: {
        skills: true,
        projects: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User profile not found',
      });
      return;
    }

    const response = await AIService.generateChatResponse(message, {
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title || 'Software Developer',
      bio: user.bio || '',
      skills: user.skills.map(skill => skill.name),
      projects: user.projects.map(project => ({
        title: project.title,
        description: project.description || '',
        techStack: project.techStack,
        category: project.category || undefined,
      })),
    });

    res.json({
      success: true,
      data: {
        message: response,
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Get skill recommendations
// @route   POST /api/ai/skill-recommendations
// @access  Public
router.post('/skill-recommendations', async (req, res): Promise<void> => {
  try {
    const { targetRole } = req.body;

    const user = await prisma.user.findFirst({
      include: {
        skills: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const currentSkills = user.skills.map(skill => skill.name);
    const recommendations = await AIService.generateSkillRecommendations(
      currentSkills,
      targetRole || 'Software Developer'
    );

    res.json({
      success: true,
      data: {
        currentSkills,
        recommendations,
        targetRole: targetRole || 'Software Developer',
      },
    });
  } catch (error) {
    console.error('Skill recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;