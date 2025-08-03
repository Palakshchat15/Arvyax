const express = require('express');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all published sessions (public)
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'published' })
      .populate('user_id', 'email')
      .sort({ created_at: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's own sessions (protected)
router.get('/my-sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ user_id: req.user._id })
      .sort({ updated_at: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single user session (protected)
router.get('/my-sessions/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save or update a draft session (protected)
router.post('/my-sessions/save-draft', authMiddleware, async (req, res) => {
  try {
    const { id, title, tags, json_file_url } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const sessionData = {
      user_id: req.user._id,
      title: title.trim(),
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim().length > 0) : [],
      json_file_url: json_file_url?.trim() || '',
      status: 'draft'
    };

    let session;
    if (id) {
      // Update existing session
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user._id },
        sessionData,
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
    } else {
      // Create new session
      session = new Session(sessionData);
      await session.save();
    }

    res.json({
      message: 'Draft saved successfully',
      session
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish a session (protected)
router.post('/my-sessions/publish', authMiddleware, async (req, res) => {
  try {
    const { id, title, tags, json_file_url } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const sessionData = {
      user_id: req.user._id,
      title: title.trim(),
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim().length > 0) : [],
      json_file_url: json_file_url?.trim() || '',
      status: 'published'
    };

    let session;
    if (id) {
      // Update existing session
      session = await Session.findOneAndUpdate(
        { _id: id, user_id: req.user._id },
        sessionData,
        { new: true, runValidators: true }
      );

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
    } else {
      // Create new session
      session = new Session(sessionData);
      await session.save();
    }

    res.json({
      message: 'Session published successfully',
      session
    });
  } catch (error) {
    console.error('Publish session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a session (protected)
router.delete('/my-sessions/:id', authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;