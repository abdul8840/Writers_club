// feedback.route.js
import express from 'express';
const router = express.Router();
import Feedback from '../models/feedback.model.js';

router.post('/', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).send(feedback);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).send(feedbacks);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
