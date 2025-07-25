import express from 'express';
import { prisma } from '../app';
// import { authenticate } from '../middleware/auth';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Public
router.get('/profile', async (req, res): Promise<void> => {
  try {
    // For now, get the first user (in a real app, you'd get by username/slug)
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        title: true,
        bio: true,
        location: true,
        avatarUrl: true,
        githubUrl: true,
        linkedinUrl: true,
        website: true,
        createdAt: true,
        projects: {
          where: { featured: true },
          take: 6,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            techStack: true,
            githubUrl: true,
            liveUrl: true,
            imageUrls: true,
            featured: true,
          },
        },
        skills: {
          orderBy: { proficiency: 'desc' },
          select: {
            id: true,
            name: true,
            category: true,
            proficiency: true,
            yearsExperience: true,
            icon: true,
            color: true,
          },
        },
        experiences: {
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
        },
        educations: {
          orderBy: { startDate: 'desc' },
          select: {
            id: true,
            institution: true,
            degree: true,
            field: true,
            gpa: true,
            startDate: true,
            endDate: true,
            current: true,
            description: true,
            achievements: true,
            location: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User profile not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
// router.put('/profile', authenticate, async (req, res) => {
//   try {
//     const {
//       firstName,
//       lastName,
//       title,
//       bio,
//       location,
//       githubUrl,
//       linkedinUrl,
//       website,
//       phone,
//     } = req.body;

//     const updatedUser = await prisma.user.update({
//       where: { id: req.user!.id },
//       data: {
//         firstName: firstName || undefined,
//         lastName: lastName || undefined,
//         title: title || undefined,
//         bio: bio || undefined,
//         location: location || undefined,
//         githubUrl: githubUrl || undefined,
//         linkedinUrl: linkedinUrl || undefined,
//         website: website || undefined,
//         phone: phone || undefined,
//       },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         title: true,
//         bio: true,
//         location: true,
//         avatarUrl: true,
//         githubUrl: true,
//         linkedinUrl: true,
//         website: true,
//         phone: true,
//         updatedAt: true,
//       },
//     });

//     res.json({
//       success: true,
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error('Update user profile error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// @desc    Upload user avatar
// @route   POST /api/user/avatar
// @access  Private
// router.post('/avatar', authenticate, async (req, res) => {
//   try {
//     const { avatarUrl } = req.body;

//     if (!avatarUrl) {
//       return res.status(400).json({
//         success: false,
//         error: 'Avatar URL is required',
//       });
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: req.user!.id },
//       data: { avatarUrl },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         avatarUrl: true,
//       },
//     });

//     res.json({
//       success: true,
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error('Upload avatar error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// @desc    Get user statistics
// @route   GET /api/user/stats
// @access  Public
router.get('/stats', async (req, res): Promise<void> => {
  try {
    // Get the first user (in a real app, you'd get by username/slug)
    const user = await prisma.user.findFirst();

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const [projectsCount, skillsCount, experienceYears] = await Promise.all([
      prisma.project.count({ where: { userId: user.id } }),
      prisma.skill.count({ where: { userId: user.id } }),
      prisma.experience.findMany({
        where: { userId: user.id },
        select: { startDate: true, endDate: true, current: true },
      }),
    ]);

    // Calculate total experience years
    const totalExperience = experienceYears.reduce((total, exp) => {
      const startDate = new Date(exp.startDate);
      const endDate = exp.current ? new Date() : new Date(exp.endDate!);
      const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return total + years;
    }, 0);

    const stats = {
      projects: projectsCount,
      skills: skillsCount,
      experience: Math.round(totalExperience * 10) / 10, // Round to 1 decimal place
      achievements: experienceYears.length, // Round to 1 decimal place*/
      // achievements: experienceYears.reduce((total, exp) => total + exp.startDate ? 1 : 0, 0),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;