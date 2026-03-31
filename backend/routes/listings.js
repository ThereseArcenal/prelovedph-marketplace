const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { auth } = require('../middleware/auth');
const { upload, uploadToSupabase, deleteFromSupabase } = require('../middleware/upload');

/**
 * @route GET /api/listings
 * @desc Get all listings with filters
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from('listings')
      .select(`
        *,
        profiles!seller_id (
          id,
          name,
          avatar_url,
          location,
          rating
        )
      `)
      .eq('status', 'active');

    // Apply category filter
    if (req.query.category && req.query.category !== 'All') {
      query = query.eq('category', req.query.category);
    }

    // Apply condition filter
    if (req.query.condition && req.query.condition !== 'All') {
      query = query.eq('condition', req.query.condition);
    }

    // Apply price filters
    if (req.query.minPrice) {
      query = query.gte('price', parseFloat(req.query.minPrice));
    }
    if (req.query.maxPrice) {
      query = query.lte('price', parseFloat(req.query.maxPrice));
    }

    // Apply search filter
    if (req.query.search) {
      query = query.or(`title.ilike.%${req.query.search}%,description.ilike.%${req.query.search}%`);
    }

    // Apply sorting
    if (req.query.sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (req.query.sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      listings: data,
      pagination: {
        page,
        limit,
        total: count || data.length
      }
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch listings' 
    });
  }
});

/**
 * @route GET /api/listings/:id
 * @desc Get single listing by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    // Increment view count
    await supabase.rpc('increment_views', { listing_id: req.params.id });

    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles!seller_id (
          id,
          name,
          email,
          avatar_url,
          location,
          phone,
          rating,
          total_sales,
          bio,
          created_at
        )
      `)
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ 
          success: false,
          message: 'Listing not found' 
        });
      }
      throw error;
    }

    res.json({
      success: true,
      listing: data
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch listing' 
    });
  }
});

/**
 * @route POST /api/listings
 * @desc Create new listing
 * @access Private
 */
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      condition,
      size,
      brand,
      color,
      location,
      contact_phone
    } = req.body;

    // Validate required fields
    if (!title || !description || !price || !category || !condition) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Upload images to Supabase
    const imageUrls = [];
    for (const file of req.files) {
      const url = await uploadToSupabase(file, req.user.id);
      imageUrls.push(url);
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'At least one image is required' 
      });
    }

    // Create listing
    const { data, error } = await supabase
      .from('listings')
      .insert({
        title,
        description,
        price: parseFloat(price),
        category,
        condition,
        size: size || null,
        brand: brand || null,
        color: color || null,
        images: imageUrls,
        location: location || null,
        seller_id: req.user.id,
        contact_phone: contact_phone || req.user.profile?.phone,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: data
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create listing' 
    });
  }
});

/**
 * @route PUT /api/listings/:id
 * @desc Update listing
 * @access Private (Seller only)
 */
router.put('/:id', auth, async (req, res) => {
  try {
    // Check ownership
    const { data: existing } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', req.params.id)
      .single();

    if (!existing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    if (existing.seller_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to edit this listing' 
      });
    }

    const { data, error } = await supabase
      .from('listings')
      .update({
        ...req.body,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Listing updated successfully',
      listing: data
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update listing' 
    });
  }
});

/**
 * @route DELETE /api/listings/:id
 * @desc Delete listing
 * @access Private (Seller only)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check ownership and get images
    const { data: listing } = await supabase
      .from('listings')
      .select('seller_id, images')
      .eq('id', req.params.id)
      .single();

    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    if (listing.seller_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this listing' 
      });
    }

    // Delete images from storage
    for (const imageUrl of listing.images) {
      await deleteFromSupabase(imageUrl, req.user.id);
    }

    // Delete listing
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete listing' 
    });
  }
});

/**
 * @route PATCH /api/listings/:id/status
 * @desc Update listing status (mark as sold, etc.)
 * @access Private (Seller only)
 */
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'sold', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status' 
      });
    }

    // Check ownership
    const { data: listing } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', req.params.id)
      .single();

    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    if (listing.seller_id !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized' 
      });
    }

    const { data, error } = await supabase
      .from('listings')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: `Listing marked as ${status}`,
      listing: data
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update status' 
    });
  }
});

/**
 * @route GET /api/listings/user/my-listings
 * @desc Get current user's listings
 * @access Private
 */
router.get('/user/my-listings', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      listings: data
    });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch your listings' 
    });
  }
});

module.exports = router;