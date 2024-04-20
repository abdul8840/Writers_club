import Comment from '../models/comment.model.js';



export const postComment = async (req, res) => {
  try {
    const { user, listing, text } = req.body;
    const newComment = new Comment({ user, listing, text });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const postReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, text } = req.body;
    const comment = await Comment.findById(id);
    comment.replies.push({ user, text });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
