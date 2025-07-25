import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../app';
import { generateToken } from '../utils/jwt';

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res): Promise<void> => {
  try {
    const { email, password, firstName, lastName, title, bio } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        success: false,
        error: 'Please provide email, password, first name, and last name',
      });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        title: title || null,
        bio: bio || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        title: true,
        bio: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
      return;
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account is deactivated',
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return user data (without password)
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    }); 
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Simple test endpoint
// @route   GET /api/auth/test
// @access  Public
router.get('/test', (req, res): void => {
  res.json({
    success: true,
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString(),
  });
});

export default router;


// import express from 'express';
// import bcrypt from 'bcryptjs';
// import { prisma } from '../app';
// import { generateToken } from '../utils/jwt';
// import { authenticate } from '../middleware/auth';

// const router = express.Router();

// // @desc    Register user
// // @route   POST /api/auth/register
// // @access  Public
// router.post('/register', async (req, res): Promise<void> => {
//   try {
//     const { email, password, firstName, lastName, title, bio } = req.body;

//     // Validation
//     if (!email || !password || !firstName || !lastName) {
//       res.status(400).json({
//         success: false,
//         error: 'Please provide email, password, first name, and last name',
//       });
//       return;
//     }

//     // Check if user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//         res.status(400).json({
//             success: false,
//             error: 'User already exists with this email',
//         });
//         return;
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(12);
//     const passwordHash = await bcrypt.hash(password, salt);

//     // Create user
//     const user = await prisma.user.create({
//       data: {
//         email,
//         passwordHash,
//         firstName,
//         lastName,
//         title: title || null,
//         bio: bio || null,
//       },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         title: true,
//         bio: true,
//         createdAt: true,
//       },
//     });

//     // Generate token
//     const token = generateToken({
//       userId: user.id,
//       email: user.email,
//     });

//     res.status(201).json({
//       success: true,
//       data: {
//         user,
//         token,
//       },
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// // @desc    Login user
// // @route   POST /api/auth/login
// // @access  Public
// router.post('/login', async (req, res):Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     // Validation
//     if (!email || !password) {
//         res.status(400).json({
//             success: false,
//             error: 'Please provide email and password',
//         });
//         return;
//     }

//     // Check if user exists
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user || !user.passwordHash) {
//       res.status(401).json({
//         success: false,
//         error: 'Invalid credentials',
//       });
//       return;
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

//     if (!isPasswordValid) {
//       res.status(401).json({
//         success: false,
//         error: 'Invalid credentials',
//       });
//       return;
//     }

//     // Check if user is active
//     if (!user.isActive) {
//       res.status(401).json({
//         success: false,
//         error: 'Account is deactivated',
//       });
//       return;
//     }

//     // Generate token
//     const token = generateToken({
//       userId: user.id,
//       email: user.email,
//     });

//     // Return user data (without password)
//     const { passwordHash, ...userWithoutPassword } = user;

//     res.json({
//       success: true,
//       data: {
//         user: userWithoutPassword,
//         token,
//       },
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// // @desc    Get current user
// // @route   GET /api/auth/me
// // @access  Private
// router.get('/me', authenticate, async (req, res): Promise<void> => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: req.user!.id },
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
//         isActive: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!user) {
//       res.status(404).json({
//         success: false,
//         error: 'User not found',
//       });
//       return;
//     }

//     res.json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     console.error('Get current user error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal server error',
//     });
//   }
// });

// // @desc    Logout user
// // @route   POST /api/auth/logout
// // @access  Private
// router.post('/logout', authenticate, (req, res): void => {
//   // In a real application, you might want to invalidate the token
//   // by adding it to a blacklist or using refresh tokens
//   res.json({
//     success: true,
//     message: 'Logged out successfully',
//   });
// });

// export default router;