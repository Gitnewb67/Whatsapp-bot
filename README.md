# Kerala Supermarket WhatsApp Bot

A WhatsApp customer service bot that lets shoppers check product availability
and prices using natural Malayalam-influenced English queries.

---

## What each file does

```
index.js                 ← Start here. Loads .env and starts the server.
src/
  server.js              ← HTTP server. Handles WhatsApp webhook + /test endpoint.
  bot.js                 ← Brain of the bot. Decides what reply to send.
  matcher.js             ← Fuzzy search using Fuse.js. Handles spelling mistakes.
  aliases.js             ← Malayalam / colloquial word dictionary (ari=rice, etc.)
  state.js               ← Remembers which customer is choosing from a list.
  erp.js                 ← Zeev ERP connection (mock by default, real with API key).
  whatsapp.js            ← WhatsApp message sender (mock by default, real with token).
data/
  products.js            ← 69 mock FMCG products. Replace with live ERP when ready.
scripts/
  test-query.js          ← Run test queries without starting the server.
.env                     ← Your secret keys (never commit this file).
.env.example             ← Template showing what keys are needed.
```

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template (already done — .env exists with placeholder values)
# Edit .env only when you have real API keys.

# 3. Run sample queries (no server needed)
npm run test-query

# 4. Start the server
npm start

# 5. Test a query via HTTP
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"text":"biriyani ari undoo"}'
```

---

## Example queries the bot understands

| Customer types           | What the bot does                          |
|--------------------------|--------------------------------------------|
| `biriyani ari undoo`     | Strips "undoo", maps "ari"→rice, finds Biriyani Rice |
| `horlics viliyo`         | Strips "viliyo", fixes "horlics"→Horlicks, lists variants |
| `enna`                   | Maps "enna"→oil, lists all oils (numbered) |
| `manja podi`             | Phrase alias → turmeric powder             |
| `parippu`                | Maps to dal, lists all dal variants        |
| `ponni rice`             | Out of stock → suggests alternatives       |
| `bornvita`               | Fuzzy match catches misspelling            |

---

## Connecting real APIs

**WhatsApp Business API:**
1. Set up a Meta Business account and create a WhatsApp Business app.
2. Copy the Phone Number ID and a permanent Access Token into `.env`.
3. Set `USE_REAL_WHATSAPP=true` in `.env`.
4. Point your webhook URL to `https://your-domain.com/webhook`.
5. Use `WHATSAPP_VERIFY_TOKEN` (any string you choose) during webhook setup.

**Zeev ERP:**
1. Get your Zeev ERP base URL and API key from your Zeev account manager.
2. Fill in `ZEEV_ERP_BASE_URL` and `ZEEV_ERP_API_KEY` in `.env`.
3. Set `USE_REAL_ERP=true` in `.env`.
4. Check `src/erp.js` — the endpoint paths (`/products`, `/products/:id`) may need
   adjusting to match your specific Zeev API configuration.

---

## Adding new Malayalam aliases

Open `src/aliases.js` and add entries to:
- `QUESTION_WORDS` — words to silently ignore (e.g. new question tags)
- `PHRASE_ALIASES` — two-or-more word phrases (checked first)
- `WORD_ALIASES`   — single word mappings

---

## Adding new products

Open `data/products.js` and add a row following the existing format:

```js
{ id: 'P070', name: 'Product Name', category: 'Category', brand: 'Brand', unit: 'kg', price: 99, stock: 50 },
```

Once you connect the real Zeev ERP (`USE_REAL_ERP=true`), this file is no longer
used — products come live from the ERP.
