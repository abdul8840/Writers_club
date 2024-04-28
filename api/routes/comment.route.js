import express from 'express';
import Comment from '../models/comment.model.js';

const router = express.Router();

// Create a comment
router.post('/', async (req, res) => {
  try {
    // Extract data from the request body
    const { content, userRef, listingRef } = req.body;

    // Validate required fields
    if (!content || !userRef || !listingRef) {
      return res.status(400).json({ message: 'Content, userRef, and listingRef are required fields' });
    }

    // Create a new comment instance
    const newComment = new Comment({
      content,
      userRef,
      listingRef,
    });

    // Save the comment to the database
    await newComment.save();

    // Send a success response
    return res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ message: 'Failed to create comment', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', error: error.stack });
  }
});

// Update a comment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment', error: error.stack });
  }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Failed to delete comment', error: error.stack });
  }
});

export default router;
