import express from 'express';
import { prisma } from '../app';
// import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        title: true,
        description: true,
        aiDescription: true,
        techStack: true,
        githubUrl: true,
        liveUrl: true,
        imageUrls: true,
        featured: true,
        startDate: true,
        endDate: true,
        status: true,
        category: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
    });

    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
// router.get('/:id', async (req, res): Promise<void> => {
//   try {
//     const { id } = req.params;
    
//     const project = await prisma.project.findUnique({
//       where: { id: parseInt(id) },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         aiDescription: true,
//         techStack: true,
//         githubUrl: true,
//         liveUrl: true,
//         imageUrls: true,
//         featured: true,
//         startDate: true,
//         endDate: true,
//         status: true,
//         category: true,
//         createdAt: true,
//         updatedAt: true,
//         user: {
//           select: {
//             firstName: true,
//             lastName: true,
//           }
//         }
//       },
//     });

//     if (!project) {
//       res.status(404).json({
//         success: false,
//         error: 'Project not found',
//       });
//       return;
//     }

//     res.json({
//       success: true,
//       data: project,
//     });
//   } catch (error) {
//     console.error('Get project error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post('/', async (req, res): Promise<void> => {
  try {
    const {
      title,
      description,
      techStack,
      githubUrl,
      liveUrl,
      imageUrls,
      featured,
      startDate,
      endDate,
      status,
      category,
    } = req.body;

    if (!title || !description) {
      res.status(400).json({
        success: false,
        error: 'Title and description are required',
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
    const project = await prisma.project.create({
      data: {
        userId: firstUser!.id,
        title,
        description,
        techStack: techStack || [],
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        imageUrls: imageUrls || [],
        featured: featured || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'completed',
        category: category || null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        techStack: true,
        githubUrl: true,
        liveUrl: true,
        imageUrls: true,
        featured: true,
        startDate: true,
        endDate: true,
        status: true,
        category: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;