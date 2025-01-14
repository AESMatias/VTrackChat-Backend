import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import openaiRoutes from './routes/openaiRoutes';
import connectDB from './db';
import logger from './logger';


dotenv.config();
require('dotenv').config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({ origin: '*' }));

// Middleware to log all incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`);
  next();
});


// Routes
app.use('/auth', authRoutes);
app.use('/openai', openaiRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`Error: ${err.message}, Path: ${req.path}, Stack: ${err.stack}`);
  res.status(err.status || 500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});