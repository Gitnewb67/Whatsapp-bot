// HTTP server — handles the WhatsApp webhook and a local test endpoint.
//
// WhatsApp requires two things on your webhook URL:
//   GET  /webhook  → verify the endpoint (one-time setup)
//   POST /webhook  → receive incoming messages
//
// The POST /test endpoint lets you simulate customer messages without WhatsApp.

const express = require('express');
const { handleIncomingMessage } = require('./bot');
const { parseWebhookPayload, sendMessage } = require('./whatsapp');

const app = express();
app.use(express.json());

// ── WhatsApp webhook verification (GET) ───────────────────────────────────────
// Meta calls this once when you register the webhook URL in the Business dashboard.
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[Webhook] Verification successful');
    return res.status(200).send(challenge);
  }

  console.warn('[Webhook] Verification failed — token mismatch');
  res.sendStatus(403);
});

// ── Incoming messages (POST) ──────────────────────────────────────────────────
app.post('/webhook', async (req, res) => {
  // Always respond 200 immediately — WhatsApp will retry if we don't.
  res.sendStatus(200);

  const message = parseWebhookPayload(req.body);
  if (!message) return; // status update / non-text message — nothing to do

  console.log(`[Message] From ${message.from}: "${message.text}"`);

  try {
    const reply = await handleIncomingMessage(message);
    if (reply) {
      await sendMessage(message.from, reply);
    }
  } catch (err) {
    console.error('[Bot] Unhandled error:', err);
  }
});

// ── Local test endpoint ────────────────────────────────────────────────────────
// Send a POST to /test with { "phone": "919876543210", "text": "biriyani ari undoo" }
// The reply is returned in the JSON response AND printed to the console.
app.post('/test', async (req, res) => {
  const { phone = '91TEST0000000', text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing "text" field in request body' });
  }

  const message = { from: phone, text };
  console.log(`[Test] From ${phone}: "${text}"`);

  try {
    const reply = await handleIncomingMessage(message);
    await sendMessage(phone, reply); // will just console.log in mock mode
    res.json({ phone, query: text, reply });
  } catch (err) {
    console.error('[Test] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Start ─────────────────────────────────────────────────────────────────────
function startServer() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`\n🛒  Kerala Supermarket WhatsApp Bot`);
    console.log(`    Server running on port ${port}`);
    console.log(`    Mock WhatsApp: ${process.env.USE_REAL_WHATSAPP !== 'true' ? 'ON (console output)' : 'OFF (real API)'}`);
    console.log(`    Mock ERP:      ${process.env.USE_REAL_ERP      !== 'true' ? 'ON (local data)'     : 'OFF (real API)'}`);
    console.log(`\n    Test a query:  curl -X POST http://localhost:${port}/test \\`);
    console.log(`                     -H "Content-Type: application/json" \\`);
    console.log(`                     -d '{"text":"biriyani ari undoo"}'\n`);
  });
}

module.exports = { startServer };
