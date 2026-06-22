import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Logging middleware in dev mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security & Parsing
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root path ping check
app.get('/', (req, res) => {
  res.json({ message: 'Authentication System API is running...' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
async function startServer() {
  try {
    // Verify database pool connection
    const client = await pool.connect();
    console.log('PostgreSQL database pool connected successfully.');
    client.release();

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed. Make sure to run DB initialization script first.');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
