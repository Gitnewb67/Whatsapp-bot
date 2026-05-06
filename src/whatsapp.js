// WhatsApp Business API client.
//
// When USE_REAL_WHATSAPP=false (default), outgoing messages are printed to the
// console instead of being sent — great for local development and testing.
// When USE_REAL_WHATSAPP=true, messages are sent via the Meta Cloud API using
// WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID from .env.

const axios = require('axios');

const USE_REAL = process.env.USE_REAL_WHATSAPP === 'true';

const waClient = axios.create({
  baseURL: `${process.env.WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}`,
  headers: {
    'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Send a text message to a WhatsApp number.
 * @param {string} to   - Recipient phone number in E.164 format (e.g. "919876543210")
 * @param {string} text - Message body
 */
async function sendMessage(to, text) {
  if (!USE_REAL) {
    console.log(`\n📤 [MOCK WhatsApp → ${to}]\n${text}\n${'─'.repeat(60)}`);
    return;
  }

  try {
    console.log('[Debug] Base URL:', waClient.defaults.baseURL);
    console.log('[Debug] Phone Number ID:', process.env.WHATSAPP_PHONE_NUMBER_ID);
    console.log('[Debug] Token prefix:', process.env.WHATSAPP_ACCESS_TOKEN?.substring(0, 20));
    await waClient.post('/messages', {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    });
  } catch (err) {
    console.error(`[WhatsApp] sendMessage to ${to} failed:`, err.response?.data || err.message);
  }
}

/**
 * Parse an incoming webhook payload from Meta and return a normalised message object.
 * Returns null if the payload doesn't contain a readable text message
 * (e.g. read receipts, status updates, image messages — we ignore those for now).
 *
 * @param {object} body - req.body from the webhook POST
 * @returns {{ from: string, text: string, messageId: string } | null}
 */
function parseWebhookPayload(body) {
  try {
    const entry   = body?.entry?.[0];
    const change  = entry?.changes?.[0];
    const value   = change?.value;
    const message = value?.messages?.[0];

    if (!message || message.type !== 'text') return null;

    return {
      from:      message.from,           // sender's phone number
      text:      message.text.body,      // message text
      messageId: message.id,
    };
  } catch {
    return null;
  }
}

module.exports = { sendMessage, parseWebhookPayload };

