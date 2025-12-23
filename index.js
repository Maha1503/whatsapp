const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = EAAMAc7bQNyUBQVPQCcIWutZAExXhFZCtGNarxPdJGoPwEkUFcZBPW7vLEkfKMX77YOu5H5HH7ZBk4BmnqnZAdzu6V0Tiugqz3SjX4gvCTGWQxQicYqQHku1SI2ltJg5BODZAZCetdiymoTbhxFvYaqjuAlbNF70PzfgYQIy6r7eD7RyZAq37El6nbYyrxrofd33D1tCakpDCx9TVGFHH1vSLw7ZBu3SMUe8drTdvG;
const ACCESS_TOKEN = EAAMAc7bQNyUBQRScWfTXO2CEzdt7EJG08RhZBgssaG7lj6rpBwwRI3FwlOyWCRcflwApdF79RZCTBOYqGzsk8elDiM6XKC1sOykYb7fboDqhmkJj472PIIexlEEzGknl5vo6zXmkAVHnemPnjZC5ZCb5Dp1jkTZB3jU4jrXhP58BZA4W5BNrPoqAXs16nFXOcuQ3OwPUITBbb2FKQtrbuerDArZAqSQEMp3g8752eERZAxoT69ARbG6t2U7E1K5W65ZBmF9eH35FShnEpITrf8VBF;
const PHONE_NUMBER_ID = 931101163416383;

// ==============================
// 1️⃣ Webhook verification (GET)
// ==============================
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified');
    return res.status(200).send(challenge);
  }

  console.log('❌ Webhook verification failed');
  return res.sendStatus(403);
});

// ==============================
// 2️⃣ Receive WhatsApp messages (POST)
// ==============================
app.post('/webhook', async (req, res) => {
  console.log('📩 Incoming webhook:', JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];

  if (message?.text) {
    const from = message.from;
    const text = message.text.body;

    console.log(`💬 Message from ${from}: ${text}`);

    // OPTIONAL: echo reply (safe for testing)
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: from,
        type: 'text',
        text: { body: `Echo: ${text}` }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  }

  res.status(200).json({ status: 'EVENT_RECEIVED' });
});

// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
