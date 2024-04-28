import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
