require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { middleware: lineMiddleware } = require('@line/bot-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// LINE Configuration
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

// Middleware
app.use(cors());
app.use(morgan('dev'));

// LINE Webhook (must be before express.json())
app.post('/webhook', lineMiddleware(lineConfig), (req, res) => {
  // Handle events here
  res.sendStatus(200);
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Evenpor LINE API Server is running.');
});

// Passenger API Routes
const passengerRoutes = require('./routes/passengerRoutes');
app.use('/api/passenger', passengerRoutes);

// Admin API Routes (Placeholder)
// app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
