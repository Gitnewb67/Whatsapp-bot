const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function extractSearchQuery(customerMessage) {
  if (!process.env.GEMINI_API_KEY) return customerMessage;

  try {
    const prompt = `You are a helper for a Kerala supermarket WhatsApp bot. Extract the product the customer is searching for from their message. The message may be in Malayalam, Manglish, or English. Return ONLY the product name in English, nothing else. If you cannot identify a product, return the original message as is.

Customer message: "${customerMessage}"`;

    const result = await model.generateContent(prompt);
    const query = result.response.text().trim();
    console.log(`[AI] "${customerMessage}" → "${query}"`);
    return query;
  } catch (err) {
    console.error('[AI] Gemini error:', err.message);
    return customerMessage;
  }
}

module.exports = { extractSearchQuery };
