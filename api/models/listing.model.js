import mongoose from 'mongoose';
const { Schema } = mongoose;

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortdescription: {
      type: String,
      required: true,
    },
    story: {
      type: String,
      required: true,
    },
    drama: {
      type: Boolean,
      required: true,
    },
    thriller: {
      type: Boolean,
      required: true,
    },
    comedy: {
      type: String,
      required: true,
    },
    action: {
      type: Boolean,
      required: true,
    },
    adventure: {
      type: Boolean,
      required: true,
    },
    horror: {
      type: String,
      required: true,
    },
    romance: {
      type: String,
      required: true,
    },
    scifi: {
      type: String,
      required: true,
    },
    historic: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    
    likes: {
      type: Number,
      default: 0
    },
    userRef: {
      type: String,
      required: true,
    },
    

  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;