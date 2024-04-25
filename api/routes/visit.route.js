// visit.route.js

import express from 'express';
import Visit from '../models/visit.model.js';

const router = express.Router();

router.post('/visit', async (req, res) => {
  const { listingId, userId } = req.body;

  try {
    // Check if the visit exists
    const visit = await Visit.findOne({ listingRef: listingId, userRef: userId });

    if (!visit) {
      // Create new visit entry
      await Visit.create({ listingRef: listingId, userRef: userId });
    }

    // Get visit count for the listing
    const visitCount = await Visit.countDocuments({ listingRef: listingId });

    res.json({ visitCount });
  } catch (error) {
    res.status(500).json({ message: 'Error counting visit' });
  }
});

export default router;

