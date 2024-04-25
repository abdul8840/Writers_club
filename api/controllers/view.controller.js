import View from '../models/view.model.js';
import Listing from '../models/listing.model.js';

export const trackView = async (req, res) => {
  const { listingId } = req.params;
  const { userRef } = req.body;

  console.log("Listing ID:", listingId);
  console.log("User Ref:", userRef);

  try {
    // Check if the user has already viewed this listing
    const existingView = await View.findOne({ listingId, userRef });
    
    if (existingView) {
      console.log("User has already viewed this listing.");
      return res.status(400).json({ success: false, message: 'User has already viewed this listing' });
    }

    // Create a new view record
    await View.create({ listingId, userRef });

    // Increase the view count in the listing model
    const listing = await Listing.findById(listingId);
    listing.views += 1;
    await listing.save();

    console.log("View tracked successfully.");
    res.json({ success: true, message: 'View tracked successfully' });

  } catch (error) {
    console.error("Error tracking view:", error);
    res.status(500).json({ success: false, message: 'Failed to track view', error: error.message });
  }
};
