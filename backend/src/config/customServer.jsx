const express = require('express');
const payload = require('payload');

const startServer = async () => {
    const app = express();
  
    // Add custom middleware
    app.use('/custom-endpoint', (req, res) => {
      res.send('This is a custom endpoint');
    });
  
    // Initialize Payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      mongoURL: process.env.MONGO_URI,
      express: app,
    });
  
    app.listen(2024, () => {
      console.log('Server is running on http://localhost:2024');
    });
  };
  
  startServer();