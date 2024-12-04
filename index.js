// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy endpoint
app.all('*', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    // Configure request options
    const config = {
      method: req.method,
      url: targetUrl,
      headers: { ...req.headers, host: new URL(targetUrl).host },
      data: req.body,
      params: req.query,
    };

    // Make the request to the target URL
    const response = await axios(config);

    // Send back the response from the target URL
    res.status(response.status).set(response.headers).send(response.data);
  } catch (error) {
    console.error('Error proxying request:', error.message);
    res.status(500).json({ error: 'Error proxying request', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`CORS Proxy Server is running on port ${PORT}`);
});
