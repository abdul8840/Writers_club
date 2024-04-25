import mongoose from 'mongoose';

const { Schema } = mongoose;

const viewSchema = new Schema({
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  userRef: {
    type: String,
    required: true,
  },
});

const View = mongoose.model('View', viewSchema);

export default View;
