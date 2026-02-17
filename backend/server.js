const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const householdRoutes = require("./routes/householdRoutes");
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/entertainment', require('./routes/entertainmentRoutes'));
app.use('/api/medical', require('./routes/medicalRoutes'));
app.use("/api/household", require("./routes/householdRoutes"));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Uniserve API is running',
    timestamp: new Date().toISOString(),
  });
});

// Static files
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});