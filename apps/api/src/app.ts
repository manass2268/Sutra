import express from 'express';
import cors from 'cors';

const app = express();

// Security aur CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Basic Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SUTRAA Backend is running!' });
});

export default app;