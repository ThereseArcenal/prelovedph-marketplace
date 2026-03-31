const { supabase } = require('../config/supabase');

/**
 * Authentication middleware
 * Verifies JWT token from Supabase
 */
const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }

    // Get user profile from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    req.user = {
      ...user,
      profile
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      message: 'Authentication failed' 
    });
  }
};

/**
 * Admin middleware - checks if user is admin
 */
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.profile?.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error checking admin status' 
    });
  }
};

module.exports = { auth, isAdmin };