const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { upload, uploadToSupabase } = require('../middleware/upload');

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim().escape(),
  body('role').toLowerCase().trim().isIn(['seller', 'buyer'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
];

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', registerValidation, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { email, password, name, role } = req.body;

    // Validate role
    if (!role || !['seller', 'buyer'].includes(role.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either seller or buyer'
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: role.toLowerCase() }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      throw error;
    }

    // Create profile with role
    await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name: name,
        email: email,
        role: role.toLowerCase(),
        created_at: new Date()
      });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for verification.',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.' 
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      success: true,
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name,
        avatar: profile?.avatar_url,
        phone: profile?.phone,
        location: profile?.location,
        role: profile?.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.' 
    });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get user data' 
    });
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, location, avatar_url, bio } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name,
        phone,
        location,
        avatar_url,
        bio,
        updated_at: new Date()
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: data
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile' 
    });
  }
});

/**
 * @route POST /api/auth/upload-avatar
 * @desc Upload user avatar
 * @access Private
 */
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload to local storage
    const imageUrl = await uploadToSupabase(req.file, req.user.id, 'local');

    // Update profile with new avatar URL
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url: imageUrl,
        updated_at: new Date()
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar_url: imageUrl,
      profile: data
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload avatar'
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post('/logout', auth, async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
    });

    if (error) {
      // Don't reveal if email exists or not (security best practice)
      console.error('Password reset error:', error);
    }

    // Always return success for security
    res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', [
  body('email').isEmail().normalizeEmail(),
  body('newPassword').isLength({ min: 6 }),
  body('token').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { email, newPassword, token } = req.body;

    // Verify and update password using Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link'
      });
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update password'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

/**
 * @route POST /api/auth/change-password
 * @desc Change password for logged-in user
 * @access Private
 */
router.post('/change-password', auth, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const email = req.user.email;

    // Verify current password is correct
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword
    });

    if (signInError) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update password'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

module.exports = router;