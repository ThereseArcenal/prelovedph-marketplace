const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { supabaseAdmin } = require('../config/supabase');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for disk storage (local files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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
 * Generate image URL for local storage
 * @param {string} filename - The saved filename
 * @returns {string} - Public URL of uploaded image (full URL)
 */
const getImageUrl = (filename) => {
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${filename}`;
};

/**
 * Upload image (local or to Supabase)
 * @param {Object} file - Multer file object
 * @param {string} userId - User ID for folder organization
 * @param {string} bucketName - Storage bucket name (local, listings, profiles)
 * @returns {Promise<string>} - Public URL of uploaded image
 */
const uploadToSupabase = async (file, userId, bucketName = 'listings') => {
  try {
    // For local storage (development)
    if (bucketName === 'local' || !process.env.SUPABASE_URL) {
      return getImageUrl(file.filename);
    }

    // For Supabase (production)
    const fileExt = path.extname(file.originalname).toLowerCase();
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucketName)
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