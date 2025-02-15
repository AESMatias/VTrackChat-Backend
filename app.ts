import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import openaiRoutes from './routes/openaiRoutes';
import applicationRoutes from './routes/applicationRoutes';
import connectDB from './db';
import logger from './logger';
import { limitMiddlewareIP } from './middleware/rateLimiterIPMiddleware';


dotenv.config();
require('dotenv').config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
app.use(express.json());
app.use(cors({ origin: '*' }));

// Allow forwarding from Nginx internal proxy to Express
app.set('trust proxy', true);

// Apply rate limiting to all incoming requests, so that no single IP can make an excessive number of requests.
app.use(limitMiddlewareIP); 

// Middleware to log all incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url} from the IP ${req.ip}`);
  next();
});


// Routes
app.use('/auth', authRoutes);
app.use('/openai', openaiRoutes);
app.use('/VTrackApp', applicationRoutes);

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