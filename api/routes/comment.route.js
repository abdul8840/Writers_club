import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const comment = new Comment({
    content: req.body.content,
    listingId: req.body.listingId,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
