import express from 'express';
import Poll from '../models/poll.model.js';

const router = express.Router();

// Fetch a poll by listing ID
router.get('/get/:listingId', async (req, res) => {
  try {
    const poll = await Poll.findOne({ listingId: req.params.listingId });

    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    res.status(200).json({ success: true, poll });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



router.post('/create', async (req, res) => {
  try {
    const { listingId, question, options } = req.body;

    const poll = new Poll({
      listingId,
      question,
      options
    });

    await poll.save();

    res.status(201).json({ success: true, poll }); // Sending back the created poll
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Vote on a poll
router.post('/vote/:pollId', async (req, res) => {
  try {
    const { option } = req.body;

    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    if (!poll.results[option]) {
      return res.status(400).json({ success: false, message: 'Invalid option' });
    }

    poll.results[option]++;

    await poll.save();

    res.status(200).json({ success: true, results: poll.results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
