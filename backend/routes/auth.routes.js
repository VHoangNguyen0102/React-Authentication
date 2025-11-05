import express from 'express';
import bcrypt from 'bcryptjs';
import {
  findUserByEmail,
  findUserById,
  generateAccessToken,
  generateRefreshToken,
  addRefreshToken,
  removeRefreshToken,
  isRefreshTokenValid,
  verifyRefreshToken
} from '../utils/auth.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user and return access + refresh tokens
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    addRefreshToken(refreshToken);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Lax for development
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // Cookie available for all paths
    });

    console.log('[Login] Cookie set successfully for user:', user.email);

    // Send response (also include refreshToken in body for now - fallback)
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken, // Include for fallback
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public
router.post('/refresh', (req, res) => {
  try {
    // Get refresh token from cookie (priority) or body (fallback for migration)
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token is required' 
      });
    }

    // Check if refresh token is in our store
    if (!isRefreshTokenValid(refreshToken)) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid refresh token' 
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      removeRefreshToken(refreshToken);
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired refresh token' 
      });
    }

    // Find user
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(403).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during token refresh' 
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user and invalidate refresh token
// @access  Public
router.post('/logout', (req, res) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      removeRefreshToken(refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      path: '/',
    });

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout' 
    });
  }
});

// @route   GET /api/auth/check
// @desc    Check if refresh token cookie exists
// @access  Public
router.get('/check', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log('[Check] Cookies received:', Object.keys(req.cookies));
  console.log('[Check] Refresh token exists:', !!refreshToken);
  
  res.json({
    success: true,
    data: {
      hasRefreshToken: !!refreshToken
    }
  });
});

export default router;
