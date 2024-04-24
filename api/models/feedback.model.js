// feedback.model.js
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    rating: Number
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
