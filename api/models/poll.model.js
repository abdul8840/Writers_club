import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  results: {
    type: Object,
    default: {}
  }
});

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
