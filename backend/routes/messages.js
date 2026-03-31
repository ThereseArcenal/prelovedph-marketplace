const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { auth } = require('../middleware/auth');

/**
 * @route POST /api/messages/start-with-seller/:listingId
 * @desc Start a conversation with the seller of a listing
 * @access Private
 */
router.post('/start-with-seller/:listingId', auth, async (req, res) => {
  try {
    const { listingId } = req.params;

    // Get listing and seller info
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, seller_id, title')
      .eq('id', listingId)
      .single();

    if (listingError || !listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Don't allow messaging yourself
    if (listing.seller_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot message yourself'
      });
    }

    // Get seller profile
    const { data: seller } = await supabase
      .from('profiles')
      .select('id, name, avatar_url')
      .eq('id', listing.seller_id)
      .single();

    const conversationId = [req.user.id, listing.seller_id].sort().join('-');

    res.json({
      success: true,
      conversationId,
      seller: {
        id: seller?.id,
        name: seller?.name,
        avatar_url: seller?.avatar_url
      },
      listing: {
        id: listing.id,
        title: listing.title
      }
    });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start conversation'
    });
  }
});

/**
 * @route GET /api/messages/conversations
 * @desc Get list of conversations for current user
 * @access Private
 */
router.get('/conversations', auth, async (req, res) => {
  try {
    // Get all messages where user is sender or receiver, grouped by conversation
    const { data: allMessages, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender_profile:sender_id(id, name, avatar_url, email),
        receiver_profile:receiver_id(id, name, avatar_url, email)
      `)
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group messages by conversation (other participant)
    const conversationMap = new Map();

    allMessages.forEach(msg => {
      const isUserSender = msg.sender_id === req.user.id;
      const participantId = isUserSender ? msg.receiver_id : msg.sender_id;
      const participantProfile = isUserSender ? msg.receiver_profile : msg.sender_profile;

      const key = [req.user.id, participantId].sort().join('-');

      if (!conversationMap.has(key)) {
        conversationMap.set(key, {
          id: key,
          participantId: participantId,
          participantName: participantProfile?.name || 'Unknown User',
          participantAvatar: participantProfile?.avatar_url,
          lastMessage: msg.message,
          lastMessageTime: msg.created_at,
          unreadCount: !msg.is_read && msg.receiver_id === req.user.id ? 1 : 0
        });
      } else {
        // Update unread count
        const conv = conversationMap.get(key);
        if (!msg.is_read && msg.receiver_id === req.user.id) {
          conv.unreadCount += 1;
        }
      }
    });

    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

/**
 * @route GET /api/messages/conversation/:conversationId
 * @desc Get all messages in a conversation
 * @access Private
 */
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const [id1, id2] = conversationId.split('-').sort();

    // Get all messages between the two users
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${id1},receiver_id.eq.${id2}),and(sender_id.eq.${id2},receiver_id.eq.${id1})`
      )
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Mark messages as read if they're for current user
    for (let msg of messages) {
      if (msg.receiver_id === req.user.id && !msg.is_read) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('id', msg.id);
      }
    }

    res.json({
      success: true,
      messages
    });
  } catch (error) {
    console.error('Get conversation messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

/**
 * @route POST /api/messages/send
 * @desc Send a message in a conversation
 * @access Private
 */
router.post('/send', auth, async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID and message are required'
      });
    }

    // Parse conversation ID to get the other user
    const [id1, id2] = conversationId.split('-').sort();
    const receiverId = id1 === req.user.id ? id2 : id1;

    // Validate receiver exists
    const { data: receiver, error: receiverError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', receiverId)
      .single();

    if (receiverError || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Create message without listing_id (general chat)
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert({
        sender_id: req.user.id,
        receiver_id: receiverId,
        message: message.trim(),
        listing_id: null
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
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

/**
 * @route GET /api/messages/my-messages
 * @desc Get all messages for current user (legacy)
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
 * @route POST /api/messages (legacy)
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

module.exports = router;