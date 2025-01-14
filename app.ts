import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import openaiRoutes from './routes/openaiRoutes';
import connectDB from './db';

dotenv.config();
require('dotenv').config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({ origin: '*' }));

// Routes
app.use('/auth', authRoutes);
app.use('/openai', openaiRoutes);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
