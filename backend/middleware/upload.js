const multer = require('multer');
const path = require('path');
const { supabaseAdmin } = require('../config/supabase');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, webp, gif)'));
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Max 5 files
  },
  fileFilter
});

/**
 * Upload image to Supabase Storage
 * @param {Object} file - Multer file object
 * @param {string} userId - User ID for folder organization
 * @returns {Promise<string>} - Public URL of uploaded image
 */
const uploadToSupabase = async (file, userId) => {
  try {
    // Generate unique filename
    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('listings')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('listings')
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Delete image from Supabase Storage
 * @param {string} imageUrl - Public URL of image
 * @param {string} userId - User ID who owns the image
 */
const deleteFromSupabase = async (imageUrl, userId) => {
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${userId}/${fileName}`;
    
    const { error } = await supabaseAdmin.storage
      .from('listings')
      .remove([filePath]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Delete error:', error);
    // Don't throw, just log - we don't want to fail the whole operation
  }
};

module.exports = { upload, uploadToSupabase, deleteFromSupabase };