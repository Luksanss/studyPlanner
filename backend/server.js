const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Semester Planner Backend is running' });
});

// Future Route: Authentication / Token generation
app.post('/api/auth', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Future Route: Fetch subject proxy
app.get('/api/courses/:courseCode', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
