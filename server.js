const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URL || process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!uri || uri.includes('postgresql')) {
      console.log('Awaiting valid MongoDB URL in .env file (add MONGODB_URI=...)');
      return;
    }
    
    await mongoose.connect(uri);
    console.log('MongoDB connection established successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
connectDB();

// API Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ status: 'ok', message: 'Backend is running', database: dbStatus });
});

// Routes
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');

app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
