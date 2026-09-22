const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

module.exports = app;