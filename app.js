const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS izinleri
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Webhook verification endpoint - GOLDEX token ile
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.VERIFY_TOKEN || 'GOLDEX';

  console.log('Webhook verification attempt:', { mode, token, verifyToken });

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.log('Verification failed');
    res.status(403).send('Forbidden');
  }
});

// Webhook endpoint for receiving messages
app.post('/webhook', (req, res) => {
  console.log('Received webhook POST:', JSON.stringify(req.body, null, 2));
  res.status(200).json({ status: 'EVENT_RECEIVED' });
});

// Ana sayfa
app.get('/', (req, res) => {
  res.send('WhatsApp Webhook Server is running! Token: GOLDEX');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Verify Token: ${process.env.VERIFY_TOKEN || 'GOLDEX'}`);
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
