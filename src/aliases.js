// Malayalam / colloquial-to-English alias dictionary.
//
// HOW THIS WORKS:
//   The bot tokenises the customer's message, strips question-words (undoo, viliyo…),
//   then replaces any known Malayalam/colloquial tokens with their English equivalents
//   before passing the query to the fuzzy matcher.
//
//   Phrases (two or more words) are checked first so "biriyani ari" → "biriyani rice"
//   takes priority over the single-token match "ari" → "rice".

// ── Question / filler words to silently strip ─────────────────────────────────
// Customers often end queries with Manglish question tags — these carry no product info.
const QUESTION_WORDS = new Set([
  'undoo', 'undo', 'undu', 'undo?',
  'viliyo', 'vilio', 'viliyoo',
  'kittumo', 'kittumoo', 'kittum',
  'undenkil', 'undo?',
  'und', 'unte',
  'cheyyumo', 'cheyyum',
  'aano', 'ano',
]);

// ── Multi-word phrase aliases (checked before single-word) ────────────────────
const PHRASE_ALIASES = {
  'biriyani ari':    'biriyani rice',
  'matta ari':       'matta rice',
  'kaikuthari ari':  'matta rice',
  'velicha enna':    'coconut oil',
  'vellicha enna':   'coconut oil',
  'thenga enna':     'coconut oil',
  'thengaenna':      'coconut oil',
  'nalla enna':      'sesame oil',
  'kaduku enna':     'mustard oil',
  'manja podi':      'turmeric powder',
  'manjal podi':     'turmeric powder',
  'mulaku podi':     'chilli powder',
  'mulak podi':      'chilli powder',
  'dhania podi':     'coriander powder',
  'kothamalli podi': 'coriander powder',
  'jeerakam podi':   'cumin powder',
  'cherupayar parippu': 'moong dal',
  'uzhunnu parippu': 'urad dal',
  'kadala parippu':  'chana dal',
  'tuvara parippu':  'toor dal',
  'godambu podi':    'wheat flour',
  'gothambu podi':   'wheat flour',
  'ari podi':        'rice flour',
  'thenga paal podi':'coconut milk powder',
  'sharkkara podi':  'jaggery powder',
};

// ── Single-word aliases ────────────────────────────────────────────────────────
const WORD_ALIASES = {
  // Rice
  'ari':          'rice',
  'choru':        'rice',
  'kaikuthari':   'matta rice',
  'jeerakasala':  'jeerakasala rice',
  'kaima':        'jeerakasala rice',

  // Flattened rice
  'aval':         'poha',
  'avalose':      'poha',

  // Oils
  'enna':         'oil',
  'velichenna':   'coconut oil',
  'thengaenna':   'coconut oil',
  'nallenna':     'sesame oil',
  'kadukenna':    'mustard oil',

  // Spices & powders
  'podi':         'powder',
  'manjal':       'turmeric',
  'manja':        'turmeric',
  'mulaku':       'chilli',
  'mulak':        'chilli',
  'kothamalli':   'coriander',
  'dhania':       'coriander',
  'jeerakam':     'cumin',
  'jeerakam':     'cumin',
  'kaduku':       'mustard seeds',
  'uluva':        'fenugreek',
  'karuva':       'cinnamon',
  'grambu':       'cloves',
  'elakka':       'cardamom',

  // Pulses
  'parippu':      'dal',
  'cherupayar':   'moong dal',
  'uzhunnu':      'urad dal',
  'kadala':       'chana',
  'tuvara':       'toor dal',

  // Flour / Grains
  'godambu':      'wheat',
  'gothambu':     'wheat',
  'rava':         'semolina',
  'sooji':        'semolina',
  'maida':        'all purpose flour',
  'besan':        'chickpea flour',

  // Sugar & Jaggery
  'panjasara':    'sugar',
  'cheeni':       'sugar',
  'uppu':         'salt',
  'sharkkara':    'jaggery',
  'sharkara':     'jaggery',
  'sarkkara':     'jaggery',

  // Dairy
  'venna':        'butter',
  'nei':          'ghee',
  'thenga paal':  'coconut milk',

  // Beverages (common misspellings included)
  'horlics':      'horlicks',
  'harlicks':     'horlicks',
  'bornvita':     'bournvita',
  'borvita':      'bournvita',
  'chaya':        'tea',
  'chaa':         'tea',
  'kaapi':        'coffee',

  // Personal care
  'mudi enna':    'hair oil',
};

module.exports = { QUESTION_WORDS, PHRASE_ALIASES, WORD_ALIASES };
