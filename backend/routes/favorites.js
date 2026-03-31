const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { auth } = require('../middleware/auth');

/**
 * @route GET /api/favorites
 * @desc Get user's favorite listings
 * @access Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        listings!listing_id (
          *,
          profiles!seller_id (id, name, avatar_url, location, rating)
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const favorites = data.map(fav => fav.listings);

    res.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch favorites' 
    });
  }
});

/**
 * @route POST /api/favorites
 * @desc Add listing to favorites
 * @access Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { listing_id } = req.body;

    if (!listing_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Listing ID is required' 
      });
    }

    // Check if listing exists
    const { data: listing } = await supabase
      .from('listings')
      .select('id')
      .eq('id', listing_id)
      .single();

    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    // Add to favorites
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: req.user.id, listing_id })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        return res.status(400).json({ 
          success: false,
          message: 'Listing already in favorites' 
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      favorite: data
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add to favorites' 
    });
  }
});

/**
 * @route DELETE /api/favorites/:listing_id
 * @desc Remove listing from favorites
 * @access Private
 */
router.delete('/:listing_id', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', req.user.id)
      .eq('listing_id', req.params.listing_id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove from favorites' 
    });
  }
});

/**
 * @route GET /api/favorites/check/:listing_id
 * @desc Check if listing is favorited
 * @access Private
 */
router.get('/check/:listing_id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('listing_id', req.params.listing_id)
      .maybeSingle();

    if (error) throw error;

    res.json({
      success: true,
      isFavorited: !!data
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.json({ 
      success: true,
      isFavorited: false 
    });
  }
});

module.exports = router;