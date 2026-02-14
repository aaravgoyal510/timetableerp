require('dotenv').config();
const path = require('path');
const express = require('express');
const app = require('./app');
const isProduction = process.env.NODE_ENV === 'production';

// Serve static files from frontend build in production (local server usage)
if (isProduction) {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  console.log(`📦 Serving frontend from: ${frontendPath}`);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Timetable ERP Server`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`⚡ API: http://localhost:${PORT}/api`);
  if (isProduction) {
    console.log(`📱 Frontend: http://localhost:${PORT}`);
  }
});
