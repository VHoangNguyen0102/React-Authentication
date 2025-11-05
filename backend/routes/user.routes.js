import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';
import { findUserById } from '../utils/auth.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching profile' 
    });
  }
});

// @route   GET /api/user/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        message: `Welcome ${req.user.name}!`,
        stats: {
          totalProjects: 12,
          activeUsers: 145,
          pendingTasks: 8,
          completedTasks: 34
        },
        recentActivity: [
          { id: 1, action: 'Logged in', timestamp: new Date().toISOString() },
          { id: 2, action: 'Updated profile', timestamp: new Date(Date.now() - 3600000).toISOString() },
          { id: 3, action: 'Completed task', timestamp: new Date(Date.now() - 7200000).toISOString() }
        ]
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching dashboard' 
    });
  }
});

// @route   GET /api/user/admin
// @desc    Get admin-only data
// @access  Private (Admin only)
router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        message: 'Admin access granted',
        adminData: {
          totalUsers: 1523,
          serverStatus: 'Healthy',
          lastBackup: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Admin endpoint error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching admin data' 
    });
  }
});

export default router;
