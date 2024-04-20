// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';

import cookieParser from 'cookie-parser';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';

import Report from "./models/report.model.js"

// import Comment from './models/comment.model.js'

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '/client/dist')));

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());


// API routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/listings', listingRouter);

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});



app.post('/api/reports', async (req, res) => {
  try {
    const { postId, reason, userId } = req.body;

    console.log('Received report data:', { postId, reason, userId });
    
    if (!postId || !reason || !userId) {
      throw new Error('Missing required fields');
    }

    const report = new Report({ postId, reason, userId });

    console.log('Saving report:', report);
    
    await report.save();
    
    console.log('Report saved successfully');

    res.status(201).json({ message: 'Reported successfully' });
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).json({ message: 'Failed to report post', error: error.stack });
  }
});




// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
