// Handles fuzzy product matching.
// Preprocessing pipeline: strip question-words → apply phrase aliases → apply word aliases → Fuse.js search.

const Fuse = require('fuse.js');
const { QUESTION_WORDS, PHRASE_ALIASES, WORD_ALIASES } = require('./aliases');
const products = require('../data/products');
const { searchProductsFromERP } = require('./erp');
const { extractSearchQuery } = require('./ai');

const USE_REAL = process.env.USE_REAL_ERP === 'true';

// Fuse.js index — built once at startup for performance
const fuse = new Fuse(products, {
  keys: [
    { name: 'name',     weight: 0.6 },
    { name: 'brand',    weight: 0.2 },
    { name: 'category', weight: 0.2 },
  ],
  threshold: 0.38,       // 0 = exact match only, 1 = match anything; 0.38 keeps results relevant
  includeScore: true,
  ignoreLocation: true,  // don't penalise matches that appear later in the string
  minMatchCharLength: 2,
});

/**
 * Normalise a customer query into clean search terms.
 * Returns the processed string so callers can log/debug it.
 */
function preprocessQuery(raw) {
  let text = raw.toLowerCase().trim();

  // 1. Remove punctuation except spaces
  text = text.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  // 2. Strip question / filler words
  const tokens = text.split(' ').filter(t => !QUESTION_WORDS.has(t));
  text = tokens.join(' ').trim();

  // 3. Apply phrase aliases (longest match first, already ordered in the object)
  for (const [phrase, replacement] of Object.entries(PHRASE_ALIASES)) {
    if (text.includes(phrase)) {
      text = text.replace(phrase, replacement);
    }
  }

  // 4. Apply single-word aliases
  const finalTokens = text.split(' ').map(token => WORD_ALIASES[token] || token);
  return finalTokens.join(' ').trim();
}

/**
 * Search for products matching the customer query.
 * Returns an array of matching products (up to `limit`), each with a `score` field.
 * Scores are normalised: 0 = perfect match, 1 = worst match (Fuse.js convention inverted here).
 */
async function searchProducts(rawQuery, limit = 6) {
  const aiQuery = await extractSearchQuery(rawQuery);
  const query = preprocessQuery(aiQuery);

  if (!query) return [];

  if (USE_REAL) {
    const erpResults = await searchProductsFromERP(query, limit);
    if (erpResults.length === 0) return [];
    const secondaryFuse = new Fuse(erpResults, {
      keys: ['name'],
      threshold: 0.3,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
    return secondaryFuse.search(query).map(r => r.item);
  }

  const results = fuse.search(query, { limit });

  return results.map(r => ({
    ...r.item,
    matchScore: r.score ?? 0,      // lower = better; 0 = perfect
    searchedAs: query,
  }));
}

/**
 * Find the closest in-stock alternatives to a given product.
 * Used when the exact product is out of stock.
 */
function findAlternatives(product, limit = 3) {
  // Search by category first, then by name fragments
  const categoryQuery = product.category;
  const results = fuse.search(categoryQuery, { limit: 15 });

  return results
    .map(r => r.item)
    .filter(p => p.id !== product.id && p.stock > 0)
    .slice(0, limit);
}

module.exports = { searchProducts, findAlternatives, preprocessQuery };
