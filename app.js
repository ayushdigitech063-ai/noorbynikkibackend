const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = app;