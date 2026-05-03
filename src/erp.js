// Zeev ERP integration.
//
// When USE_REAL_ERP=false (default), functions read from the local mock data.
// When USE_REAL_ERP=true, they call the real Zeev REST API using ZEEV_ERP_BASE_URL
// and ZEEV_ERP_API_KEY from .env — no code changes needed.
//
// The function signatures stay identical in both modes so the rest of the bot
// doesn't need to know which mode is active.

const axios = require('axios');
const mockProducts = require('../data/products');

const USE_REAL = process.env.USE_REAL_ERP === 'true';

const erpClient = axios.create({
  baseURL: process.env.ZEEV_ERP_BASE_URL,
  headers: {
    'Authorization': `Bearer ${process.env.ZEEV_ERP_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// ── Mock helpers ──────────────────────────────────────────────────────────────

function findMockById(productId) {
  return mockProducts.find(p => p.id === productId) || null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch live stock and price for a single product by its ERP product ID.
 * Returns { price, stock, unit } or null if the product isn't found.
 */
async function getProductDetails(productId) {
  if (!USE_REAL) {
    const p = findMockById(productId);
    if (!p) return null;
    return { price: p.price, stock: p.stock, unit: p.unit };
  }

  // ── Real Zeev API call ──
  // Adjust the endpoint path to match your actual Zeev API spec.
  try {
    const { data } = await erpClient.get(`/products/${productId}`);
    return {
      price: data.selling_price,
      stock: data.available_qty,
      unit:  data.unit_of_measure,
    };
  } catch (err) {
    console.error(`[ERP] getProductDetails(${productId}) failed:`, err.message);
    return null;
  }
}

/**
 * Fetch the full product catalogue from the ERP.
 * In mock mode returns the local data file.
 * In production you'd call the ERP search/list endpoint.
 */
async function getAllProducts() {
  if (!USE_REAL) {
    return mockProducts;
  }

  try {
    const { data } = await erpClient.get('/products', {
      params: { active: true, page_size: 500 },
    });
    // Normalise ERP response shape to match our internal format
    return data.items.map(item => ({
      id:       item.product_code,
      name:     item.product_name,
      category: item.category,
      brand:    item.brand,
      unit:     item.unit_of_measure,
      price:    item.selling_price,
      stock:    item.available_qty,
    }));
  } catch (err) {
    console.error('[ERP] getAllProducts() failed:', err.message);
    return [];
  }
}

module.exports = { getProductDetails, getAllProducts };
