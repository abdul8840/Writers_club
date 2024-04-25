import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  listingRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
