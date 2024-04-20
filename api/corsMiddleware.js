// corsMiddleware.js

import express from 'express';

const corsMiddleware = express.Router();

corsMiddleware.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

export default corsMiddleware;
