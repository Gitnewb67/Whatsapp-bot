// Core bot logic — this file decides what reply to send for every incoming message.
//
// Flow:
//   1. Is the customer picking from a numbered disambiguation list?  → handle selection
//   2. Otherwise → search for their product query
//      a. No matches         → "not found" reply
//      b. Exactly one match  → show price + stock (or out-of-stock alternatives)
//      c. Multiple matches   → list them numbered, save state, wait for selection

const { searchProducts, findAlternatives } = require('./matcher');
const { getProductDetails } = require('./erp');
const {
  setDisambiguation,
  getDisambiguation,
  clearSession,
  isNumberSelection,
} = require('./state');

// ── Reply builders ────────────────────────────────────────────────────────────

function inStockReply(product, details) {
  const stockLabel = details.stock <= 10 ? `⚠️ Only ${details.stock} left` : `✅ In stock`;
  return (
    `*${product.name}* — ${product.brand}\n` +
    `💰 ₹${details.price} / ${details.unit}\n` +
    `${stockLabel}\n\n` +
    `Type another product name to search again.`
  );
}

function outOfStockReply(product, alternatives) {
  let reply =
    `❌ *${product.name}* (${product.brand}) is currently *out of stock*.\n\n`;

  if (alternatives.length === 0) {
    reply += `Sorry, no alternatives are available right now. Please check back later.`;
    return reply;
  }

  reply += `Here are similar products that are available:\n\n`;
  alternatives.forEach((alt, i) => {
    reply += `${i + 1}. *${alt.name}* — ${alt.brand}  ₹${alt.price}/${alt.unit}  (${alt.stock} in stock)\n`;
  });
  reply += `\nReply with a number to see details, or type a new search.`;
  return reply;
}

function disambiguationReply(products) {
  let reply = `I found ${products.length} matching products. Which one do you mean?\n\n`;
  products.forEach((p, i) => {
    const stockTag = p.stock > 0 ? `₹${p.price}/${p.unit}` : `OUT OF STOCK`;
    reply += `${i + 1}. *${p.name}* — ${p.brand}  (${stockTag})\n`;
  });
  reply += `\nReply with a number (e.g. *1*) to get full details.`;
  return reply;
}

function notFoundReply(query) {
  return (
    `Sorry, I couldn't find any product matching "*${query}*".\n\n` +
    `Try a different spelling, or ask for a category like:\n` +
    `• _rice_ • _oil_ • _dal_ • _powder_ • _tea_`
  );
}

// ── Main handler ──────────────────────────────────────────────────────────────

/**
 * Process an incoming message and return a reply string.
 * @param {{ from: string, text: string }} message
 * @returns {Promise<string>}
 */
async function handleIncomingMessage({ from, text }) {
  const trimmed = text.trim();

  // ── Case 1: Customer is picking from a disambiguation list ──────────────────
  const session = getDisambiguation(from);
  if (session && isNumberSelection(trimmed)) {
    const choice = parseInt(trimmed, 10);

    if (choice < 1 || choice > session.products.length) {
      return `Please reply with a number between 1 and ${session.products.length}.`;
    }

    const chosen = session.products[choice - 1];
    clearSession(from);

    // Fetch live details from ERP
    const details = await getProductDetails(chosen.id);
    if (!details) {
      return `Sorry, I couldn't retrieve details for that product right now. Please try again.`;
    }

    if (details.stock === 0) {
      const alternatives = findAlternatives(chosen);
      // Save alternatives as a new session so the customer can pick one
      if (alternatives.length > 0) {
        setDisambiguation(from, alternatives);
      }
      return outOfStockReply(chosen, alternatives);
    }

    return inStockReply(chosen, details);
  }

  // If they have an active session but typed something other than a number,
  // treat it as a new search and clear the old session.
  if (session) {
    clearSession(from);
  }

  // ── Case 2: Fresh product search ───────────────────────────────────────────
  const rawQuery = trimmed;

  if (rawQuery.length < 2) {
    return (
      `Welcome to our store! 🛒\n\n` +
      `Type any product name to check availability and price.\n` +
      `You can use Malayalam names too — e.g. *ari*, *enna*, *parippu*, *horlics*`
    );
  }

  const matches = searchProducts(rawQuery);

  if (matches.length === 0) {
    return notFoundReply(rawQuery);
  }

  // If the top match is a high-confidence hit and the next match is noticeably worse,
  // skip the disambiguation list and show the top result directly.
  const topScore    = matches[0].matchScore;
  const secondScore = matches[1]?.matchScore ?? 1;
  const isConfidentSingle = topScore < 0.12 && (secondScore - topScore) > 0.15;

  // Single clear match
  if (matches.length === 1 || isConfidentSingle) {
    const product = matches[0];
    const details = await getProductDetails(product.id);

    if (!details) {
      return `Sorry, I couldn't retrieve details right now. Please try again.`;
    }

    if (details.stock === 0) {
      const alternatives = findAlternatives(product);
      if (alternatives.length > 0) {
        setDisambiguation(from, alternatives);
      }
      return outOfStockReply(product, alternatives);
    }

    return inStockReply(product, details);
  }

  // Multiple matches — ask customer to choose
  // Keep only the top MAX_DISAMBIGUATION results to avoid overwhelming the customer
  const MAX_DISAMBIGUATION = 5;
  const shortlist = matches.slice(0, MAX_DISAMBIGUATION);

  setDisambiguation(from, shortlist);
  return disambiguationReply(shortlist);
}

module.exports = { handleIncomingMessage };
