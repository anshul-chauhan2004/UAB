require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));

// MySQL Connection
const db = require('../database/config');

// API Routes - MySQL-backed Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/students', require('./routes/students'));
app.use('/api/announcements', require('./routes/announcements'));

// Additional MySQL Routes
app.use('/api/assignments', require('./routes/api/assignments'));
app.use('/api/assessments', require('./routes/api/assessments'));
app.use('/api/attendance', require('./routes/api/attendance'));
app.use('/api/notifications', require('./routes/api/notifications'));

// Serve React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
