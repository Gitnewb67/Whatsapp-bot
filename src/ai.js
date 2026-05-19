const axios = require('axios');

async function extractSearchQuery(customerMessage) {
  if (!process.env.GEMINI_API_KEY) return customerMessage;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `You are a helper for a Kerala supermarket WhatsApp bot. Extract the product the customer is searching for from their message. The message may be in Malayalam, Manglish, or English. Return ONLY the product name in English, nothing else. If you cannot identify a product, return the original message as is.\n\nCustomer message: "${customerMessage}"`
          }]
        }]
      },
      { timeout: 5000 }
    );

    const query = response.data.candidates[0].content.parts[0].text.trim();
    console.log(`[AI] "${customerMessage}" → "${query}"`);
    return query;
  } catch (err) {
    console.error('[AI] Gemini error:', err.message);
    return customerMessage;
  }
}

module.exports = { extractSearchQuery };
