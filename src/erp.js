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
    'x-api-key': process.env.ZEEV_ERP_API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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
    const params = {
      search:            '',
      'searchFields[]':  'item_name',
      page:              0,
      pageSize:          8,
    };
    if (process.env.ZEEV_BRANCH_ID) {
      params.branch_id = process.env.ZEEV_BRANCH_ID;
    }

    const { data } = await erpClient.get('/api/v1/items', { params });
    return data.items.map(item => ({
      id:       item.item_code,
      name:     item.item_name,
      category: item.category,
      brand:    item.brand,
      unit:     item.unit_of_measure,
      price:    item.selling_price,
      mrp:      item.mrp,
      stock:    item.available_qty,
    }));
  } catch (err) {
    console.error('[ERP] getAllProducts() failed:', err.message);
    return [];
  }
}

/**
 * Search the ERP catalogue by keyword and return results in the same shape
 * as matcher.js's Fuse.js results (matchScore + searchedAs fields included).
 * Only called when USE_REAL_ERP=true.
 */
async function searchProductsFromERP(query, limit = 8) {
  try {
    const params = {
      search:       query,
      searchFields: 'item_name',
      page:         0,
      pageSize:     limit,
    };
    if (process.env.ZEEV_BRANCH_ID) {
      params.branch_id = process.env.ZEEV_BRANCH_ID;
    }

    console.log('[ERP] request URL:', erpClient.getUri({ url: '/api/v1/items', params }));
    const { data } = await erpClient.get('/api/v1/items', { params });
    console.log('Zeev raw response:', JSON.stringify(data));
    return (data.list || data.items || []).map(item => ({
      id:         item.item_code,
      name:       item.item_name,
      category:   item.category,
      brand:      '',
      unit:       '',
      price:      item.selling_price,
      mrp:        item.mrp,
      stock:      item.stock > 0 ? 1 : 0,
      matchScore: 0,
      searchedAs: query,
    }));
  } catch (err) {
    console.error(`[ERP] searchProductsFromERP(${query}) failed:`, err.stack || err);
    return [];
  }
}

module.exports = { getProductDetails, getAllProducts, searchProductsFromERP };
