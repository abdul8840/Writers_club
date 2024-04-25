// feedback.model.js
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    rating: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});



const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
