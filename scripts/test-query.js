// Quick command-line tester — no server needed.
// Usage:  node scripts/test-query.js "biriyani ari undoo"
//         node scripts/test-query.js "horlics viliyo"
//         node scripts/test-query.js "enna"

require('dotenv').config();

const { handleIncomingMessage } = require('../src/bot');

const PHONE = '91TEST0000000';

async function run() {
  const queries = process.argv.slice(2);

  if (queries.length === 0) {
    // Run a default set of sample queries that cover common scenarios
    const samples = [
      'biriyani ari undoo',
      'horlics viliyo',
      'matta ari kittumo',
      'enna',            // ambiguous — multiple oils
      'parippu',         // ambiguous — multiple dals
      'bornvita',        // misspelling of Bournvita
      'manja podi',      // Malayalam → turmeric powder
      'ponni rice',      // out of stock product
      'xyz unknown product',
    ];

    console.log('═'.repeat(60));
    console.log('  Sample Query Test Run');
    console.log('═'.repeat(60));

    for (const q of samples) {
      console.log(`\n▶  Customer: "${q}"`);
      const reply = await handleIncomingMessage({ from: PHONE, text: q });
      console.log(`◀  Bot:\n${reply}`);
      console.log('─'.repeat(60));
    }
  } else {
    // Test a specific query passed as CLI argument
    for (const q of queries) {
      console.log(`\n▶  Customer: "${q}"`);
      const reply = await handleIncomingMessage({ from: PHONE, text: q });
      console.log(`◀  Bot:\n${reply}`);
    }
  }
}

run().catch(console.error);
