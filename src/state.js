// Conversation state manager.
// Tracks which customers are mid-disambiguation (waiting for them to pick a numbered product).
// State is in-memory — a customer's state is automatically cleared after TIMEOUT_MS.
// If you later need persistence across restarts, swap the Map for a Redis client here.

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes of inactivity clears the state

// Map of phone number → { products: [...], timer: TimeoutHandle }
const sessions = new Map();

/**
 * Save a disambiguation state for a customer.
 * @param {string} phone  - Customer's WhatsApp phone number (e.g. "919876543210")
 * @param {Array}  products - Shortlisted products the customer is choosing between
 */
function setDisambiguation(phone, products) {
  clearSession(phone); // clear any existing timer first

  const timer = setTimeout(() => sessions.delete(phone), TIMEOUT_MS);

  // Allow Node.js to exit even if this timer is still pending
  if (timer.unref) timer.unref();

  sessions.set(phone, { products, timer });
}

/**
 * Retrieve the current disambiguation state for a customer.
 * Returns null if there is no active session.
 */
function getDisambiguation(phone) {
  return sessions.get(phone) || null;
}

/**
 * Remove the disambiguation state for a customer (after they pick, or on timeout).
 */
function clearSession(phone) {
  const existing = sessions.get(phone);
  if (existing) {
    clearTimeout(existing.timer);
    sessions.delete(phone);
  }
}

/**
 * Returns true if the message looks like a numbered selection (1, 2, 3 …).
 */
function isNumberSelection(text) {
  return /^\s*[1-9]\d?\s*$/.test(text.trim());
}

// ── Cart ──────────────────────────────────────────────────────────────────────

// Map of phone number → Array of { id, name, brand, unit, price, qty }
const carts = new Map();

function addToCart(phone, product, qty = 1) {
  const cart = carts.get(phone) || [];
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, brand: product.brand, unit: product.unit, price: product.price, qty });
  }
  carts.set(phone, cart);
}

function getCart(phone) {
  return carts.get(phone) || [];
}

function clearCart(phone) {
  carts.delete(phone);
}

function getCartSummary(phone) {
  const cart = getCart(phone);
  if (cart.length === 0) return 'Your cart is empty.';
  let total = 0;
  let summary = '*Your cart:*\n\n';
  cart.forEach((item, i) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    summary += `${i + 1}. *${item.name}* × ${item.qty}  ₹${lineTotal}\n`;
  });
  summary += `\n*Total: ₹${total}*`;
  return summary;
}

module.exports = { setDisambiguation, getDisambiguation, clearSession, isNumberSelection, addToCart, getCart, clearCart, getCartSummary };
