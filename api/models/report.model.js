import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    enum: ['sexual content', 'violent or repulsive content', 'spam or misleading', 'child abuse', 'harmful and dangerous acts', 'copyright issue'],
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Report', reportSchema);
