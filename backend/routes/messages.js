const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { auth } = require('../middleware/auth');

/**
 * @route POST /api/messages
 * @desc Send message about a listing
 * @access Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { listing_id, message } = req.body;

    if (!listing_id || !message || message.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'Listing ID and message are required' 
      });
    }

    // Get listing to find seller
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('seller_id, title')
      .eq('id', listing_id)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    // Don't allow sending message to yourself
    if (listing.seller_id === req.user.id) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot message yourself about your own listing' 
      });
    }

    // Create message
    const { data, error } = await supabase
      .from('messages')
      .insert({
        listing_id,
        sender_id: req.user.id,
        receiver_id: listing.seller_id,
        message: message.trim()
      })
      .select(`
        *,
        profiles!sender_id (id, name, avatar_url),
        listings!listing_id (id, title, images)
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to send message' 
    });
  }
});

/**
 * @route GET /api/messages/my-messages
 * @desc Get all messages for current user
 * @access Private
 */
router.get('/my-messages', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles!sender_id (id, name, avatar_url),
        profiles!receiver_id (id, name, avatar_url),
        listings!listing_id (id, title, images, price, status)
      `)
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by conversation
    const conversations = new Map();
    
    data.forEach(msg => {
      const otherUser = msg.sender_id === req.user.id ? msg.profiles_receiver_id : msg.profiles_sender_id;
      const key = `${otherUser.id}-${msg.listing_id}`;
      
      if (!conversations.has(key) || conversations.get(key).created_at < msg.created_at) {
        conversations.set(key, {
          ...msg,
          other_user: otherUser,
          listing: msg.listings
        });
      }
    });

    res.json({
      success: true,
      messages: data,
      conversations: Array.from(conversations.values())
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch messages' 
    });
  }
});

/**
 * @route PATCH /api/messages/:id/read
 * @desc Mark message as read
 * @access Private
 */
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', req.params.id)
      .eq('receiver_id', req.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ 
          success: false,
          message: 'Message not found' 
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to mark message as read' 
    });
  }
});

/**
 * @route GET /api/messages/unread/count
 * @desc Get unread message count for current user
 * @access Private
 */
router.get('/unread/count', auth, async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', req.user.id)
      .eq('is_read', false);

    if (error) throw error;

    res.json({
      success: true,
      count: count || 0
    });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get unread count' 
    });
  }
});

module.exports = router;