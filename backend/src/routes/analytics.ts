import express from 'express';
import { prisma } from '../app';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = express.Router();

// @desc    Track user event
// @route   POST /api/analytics/track
// @access  Public
router.post('/track', optionalAuth, async (req, res): Promise<void> => {
  try {
    const { eventType, eventData } = req.body;

    if (!eventType) {
      res.status(400).json({
        success: false,
        error: 'Event type is required',
      });
      return;
    }

    const analytics = await prisma.analytics.create({
      data: {
        userId: req.user?.id || null,
        eventType,
        eventData: eventData || null,
        visitorIp: req.ip || null,
        userAgent: req.get('User-Agent') || null,
        referer: req.get('Referer') || null,
      },
    });

    res.status(201).json({
      success: true,
      data: { id: analytics.id },
    });
  } catch (error) {
    console.error('Track analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Get analytics stats
// @route   GET /api/analytics/stats
// @access  Private
router.get('/stats', authenticate, async (req, res): Promise<void>  => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause: any = {};
    if (startDate) {
      whereClause.timestamp = { gte: new Date(startDate as string) };
    }
    if (endDate) {
      whereClause.timestamp = {
        ...whereClause.timestamp,
        lte: new Date(endDate as string),
      };
    }

    const [totalEvents, eventsByType, uniqueVisitors] = await Promise.all([
      prisma.analytics.count({ where: whereClause }),
      prisma.analytics.groupBy({
        by: ['eventType'],
        where: whereClause,
        _count: { eventType: true },
      }),
      prisma.analytics.findMany({
        where: whereClause,
        select: { visitorIp: true },
        distinct: ['visitorIp'],
      }),
    ]);

    const stats = {
      totalEvents,
      uniqueVisitors: uniqueVisitors.length,
      eventsByType: eventsByType.reduce((acc, item) => {
        acc[item.eventType] = item._count.eventType;
        return acc;
      }, {} as Record<string, number>),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get analytics stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// @desc    Simple analytics test endpoint
// @route   GET /api/analytics/test
// @access  Public
router.get('/test', (req, res): void => {
  res.json({
    success: true,
    message: 'Analytics routes are working!',
    timestamp: new Date().toISOString(),
  });
});

export default router;