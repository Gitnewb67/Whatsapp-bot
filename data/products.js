// Mock product catalog for development.
// In production this data comes live from the Zeev ERP API (see src/erp.js).
// Each product matches exactly what the ERP returns so swapping is seamless.

const products = [

  // ── RICE ────────────────────────────────────────────────────────────────────
  { id: 'P001', name: 'Jeerakasala Rice',              category: 'Rice',             brand: 'Double Horse', unit: 'kg',   price: 95,  stock: 150 },
  { id: 'P002', name: 'Matta Rice',                    category: 'Rice',             brand: 'Nirapara',     unit: 'kg',   price: 52,  stock: 200 },
  { id: 'P003', name: 'Basmati Rice',                  category: 'Rice',             brand: 'India Gate',   unit: 'kg',   price: 145, stock: 80  },
  { id: 'P004', name: 'Ponni Rice',                    category: 'Rice',             brand: 'Double Horse', unit: 'kg',   price: 58,  stock: 0   },
  { id: 'P005', name: 'Biriyani Rice',                 category: 'Rice',             brand: 'Eastern',      unit: 'kg',   price: 98,  stock: 120 },
  { id: 'P006', name: 'Red Rice',                      category: 'Rice',             brand: 'Nirapara',     unit: 'kg',   price: 65,  stock: 75  },
  { id: 'P007', name: 'Palakkadan Matta Rice',         category: 'Rice',             brand: 'Nirapara',     unit: 'kg',   price: 60,  stock: 90  },

  // ── FLATTENED RICE (AVAL / POHA) ─────────────────────────────────────────
  { id: 'P008', name: 'Aval Thick (Poha)',             category: 'Flattened Rice',   brand: 'Double Horse', unit: '500g', price: 45,  stock: 60  },
  { id: 'P009', name: 'Aval Thin (Poha)',              category: 'Flattened Rice',   brand: 'Nirapara',     unit: '500g', price: 42,  stock: 0   },
  { id: 'P010', name: 'Beaten Rice Medium',            category: 'Flattened Rice',   brand: 'Eastern',      unit: '500g', price: 40,  stock: 45  },

  // ── OILS ─────────────────────────────────────────────────────────────────
  { id: 'P011', name: 'Coconut Oil',                   category: 'Oil',              brand: 'Parachute',    unit: 'litre',price: 210, stock: 45  },
  { id: 'P012', name: 'Coconut Oil',                   category: 'Oil',              brand: 'KLF Coconad',  unit: 'litre',price: 198, stock: 30  },
  { id: 'P013', name: 'Coconut Oil',                   category: 'Oil',              brand: 'Gold Winner',  unit: 'litre',price: 205, stock: 0   },
  { id: 'P014', name: 'Sunflower Oil',                 category: 'Oil',              brand: 'Saffola',      unit: 'litre',price: 165, stock: 55  },
  { id: 'P015', name: 'Sunflower Oil',                 category: 'Oil',              brand: 'Fortune',      unit: 'litre',price: 158, stock: 0   },
  { id: 'P016', name: 'Groundnut Oil',                 category: 'Oil',              brand: 'Dhara',        unit: 'litre',price: 185, stock: 25  },
  { id: 'P017', name: 'Mustard Oil',                   category: 'Oil',              brand: 'Kachi Ghani',  unit: 'litre',price: 175, stock: 20  },
  { id: 'P018', name: 'Sesame Oil',                    category: 'Oil',              brand: 'Nirapara',     unit: '200ml',price: 145, stock: 35  },

  // ── SPICES & MASALA ──────────────────────────────────────────────────────
  { id: 'P019', name: 'Turmeric Powder',               category: 'Spices',           brand: 'Eastern',      unit: '100g', price: 38,  stock: 90  },
  { id: 'P020', name: 'Chilli Powder',                 category: 'Spices',           brand: 'Eastern',      unit: '200g', price: 65,  stock: 85  },
  { id: 'P021', name: 'Coriander Powder',              category: 'Spices',           brand: 'Nirapara',     unit: '200g', price: 55,  stock: 70  },
  { id: 'P022', name: 'Pepper Powder',                 category: 'Spices',           brand: 'Eastern',      unit: '50g',  price: 75,  stock: 50  },
  { id: 'P023', name: 'Garam Masala',                  category: 'Spices',           brand: 'Eastern',      unit: '50g',  price: 45,  stock: 50  },
  { id: 'P024', name: 'Biriyani Masala',               category: 'Spices',           brand: 'Eastern',      unit: '50g',  price: 48,  stock: 60  },
  { id: 'P025', name: 'Fish Curry Masala',             category: 'Spices',           brand: 'Eastern',      unit: '50g',  price: 42,  stock: 55  },
  { id: 'P026', name: 'Sambar Powder',                 category: 'Spices',           brand: 'MTR',          unit: '100g', price: 52,  stock: 40  },
  { id: 'P027', name: 'Rasam Powder',                  category: 'Spices',           brand: 'MTR',          unit: '100g', price: 48,  stock: 35  },
  { id: 'P028', name: 'Cumin (Jeerakam)',              category: 'Spices',           brand: 'Nirapara',     unit: '100g', price: 65,  stock: 45  },
  { id: 'P029', name: 'Mustard Seeds',                 category: 'Spices',           brand: 'Eastern',      unit: '100g', price: 28,  stock: 80  },
  { id: 'P030', name: 'Fenugreek (Uluva)',             category: 'Spices',           brand: 'Eastern',      unit: '100g', price: 32,  stock: 60  },

  // ── HEALTH DRINKS ────────────────────────────────────────────────────────
  { id: 'P031', name: 'Horlicks Classic',              category: 'Health Drinks',    brand: 'Horlicks',     unit: '500g', price: 285, stock: 35  },
  { id: 'P032', name: 'Horlicks Junior',               category: 'Health Drinks',    brand: 'Horlicks',     unit: '500g', price: 310, stock: 20  },
  { id: 'P033', name: 'Horlicks Mothers',              category: 'Health Drinks',    brand: 'Horlicks',     unit: '500g', price: 340, stock: 0   },
  { id: 'P034', name: 'Bournvita',                     category: 'Health Drinks',    brand: 'Cadbury',      unit: '500g', price: 275, stock: 40  },
  { id: 'P035', name: 'Complan',                       category: 'Health Drinks',    brand: 'Complan',      unit: '500g', price: 320, stock: 0   },
  { id: 'P036', name: 'Milo',                          category: 'Health Drinks',    brand: 'Nestle',       unit: '400g', price: 260, stock: 25  },
  { id: 'P037', name: 'Boost',                         category: 'Health Drinks',    brand: 'Boost',        unit: '500g', price: 270, stock: 30  },

  // ── TEA & COFFEE ─────────────────────────────────────────────────────────
  { id: 'P038', name: 'Tea Dust',                      category: 'Tea',              brand: 'Wagh Bakri',   unit: '250g', price: 95,  stock: 80  },
  { id: 'P039', name: 'Tea Dust',                      category: 'Tea',              brand: 'Red Label',    unit: '250g', price: 88,  stock: 0   },
  { id: 'P040', name: 'Tea Leaves',                    category: 'Tea',              brand: 'Tata Tea Gold',unit: '250g', price: 110, stock: 65  },
  { id: 'P041', name: 'Green Tea',                     category: 'Tea',              brand: 'Tetley',       unit: '25 bags',price: 145,stock: 30 },
  { id: 'P042', name: 'Filter Coffee Powder',          category: 'Coffee',           brand: 'Cothas',       unit: '500g', price: 265, stock: 40  },
  { id: 'P043', name: 'Nescafe Classic',               category: 'Coffee',           brand: 'Nestle',       unit: '100g', price: 310, stock: 20  },

  // ── PULSES / DAL ─────────────────────────────────────────────────────────
  { id: 'P044', name: 'Toor Dal',                      category: 'Pulses',           brand: 'Double Horse', unit: 'kg',   price: 135, stock: 90  },
  { id: 'P045', name: 'Moong Dal',                     category: 'Pulses',           brand: 'Nirapara',     unit: 'kg',   price: 125, stock: 85  },
  { id: 'P046', name: 'Urad Dal',                      category: 'Pulses',           brand: 'Double Horse', unit: 'kg',   price: 140, stock: 70  },
  { id: 'P047', name: 'Chana Dal',                     category: 'Pulses',           brand: 'Nirapara',     unit: 'kg',   price: 115, stock: 0   },
  { id: 'P048', name: 'Masoor Dal',                    category: 'Pulses',           brand: 'Double Horse', unit: 'kg',   price: 120, stock: 60  },
  { id: 'P049', name: 'Kabuli Chana',                  category: 'Pulses',           brand: 'Nirapara',     unit: 'kg',   price: 130, stock: 45  },

  // ── FLOUR ────────────────────────────────────────────────────────────────
  { id: 'P050', name: 'Wheat Flour (Atta)',             category: 'Flour',            brand: 'Aashirvaad',   unit: 'kg',   price: 58,  stock: 100 },
  { id: 'P051', name: 'Rice Flour',                    category: 'Flour',            brand: 'Double Horse', unit: '500g', price: 35,  stock: 80  },
  { id: 'P052', name: 'Rava (Semolina)',                category: 'Flour',            brand: 'Double Horse', unit: '500g', price: 38,  stock: 75  },
  { id: 'P053', name: 'Maida (All Purpose Flour)',      category: 'Flour',            brand: 'Pillsbury',    unit: 'kg',   price: 55,  stock: 60  },
  { id: 'P054', name: 'Besan (Chickpea Flour)',         category: 'Flour',            brand: 'Nirapara',     unit: '500g', price: 65,  stock: 55  },

  // ── SUGAR, SALT & JAGGERY ────────────────────────────────────────────────
  { id: 'P055', name: 'Sugar',                         category: 'Sugar & Salt',     brand: 'Generic',      unit: 'kg',   price: 42,  stock: 200 },
  { id: 'P056', name: 'Salt',                          category: 'Sugar & Salt',     brand: 'Tata Salt',    unit: 'kg',   price: 24,  stock: 150 },
  { id: 'P057', name: 'Jaggery (Sharkkara)',           category: 'Sugar & Salt',     brand: 'Nirapara',     unit: 'kg',   price: 68,  stock: 40  },
  { id: 'P058', name: 'Brown Sugar',                   category: 'Sugar & Salt',     brand: 'Generic',      unit: 'kg',   price: 58,  stock: 30  },

  // ── DAIRY & COCONUT ──────────────────────────────────────────────────────
  { id: 'P059', name: 'Coconut Milk Powder',           category: 'Dairy',            brand: 'Maggi',        unit: '100g', price: 75,  stock: 45  },
  { id: 'P060', name: 'Ghee',                          category: 'Dairy',            brand: 'Amul',         unit: '500ml',price: 330, stock: 25  },
  { id: 'P061', name: 'Ghee',                          category: 'Dairy',            brand: 'Milma',        unit: '500ml',price: 315, stock: 15  },
  { id: 'P062', name: 'Butter',                        category: 'Dairy',            brand: 'Amul',         unit: '500g', price: 265, stock: 20  },

  // ── PERSONAL CARE ────────────────────────────────────────────────────────
  { id: 'P063', name: 'Coconut Hair Oil',              category: 'Personal Care',    brand: 'Parachute',    unit: '200ml',price: 95,  stock: 50  },
  { id: 'P064', name: 'Coconut Hair Oil',              category: 'Personal Care',    brand: 'Nihar',        unit: '200ml',price: 88,  stock: 0   },

  // ── NOODLES & PASTA ──────────────────────────────────────────────────────
  { id: 'P065', name: 'Maggi Noodles',                 category: 'Noodles',          brand: 'Nestle',       unit: '70g',  price: 15,  stock: 200 },
  { id: 'P066', name: 'Yippee Noodles',                category: 'Noodles',          brand: 'Sunfeast',     unit: '70g',  price: 14,  stock: 180 },

  // ── BISCUITS ─────────────────────────────────────────────────────────────
  { id: 'P067', name: 'Marie Gold Biscuits',           category: 'Biscuits',         brand: 'Britannia',    unit: '250g', price: 38,  stock: 120 },
  { id: 'P068', name: 'Good Day Biscuits',             category: 'Biscuits',         brand: 'Britannia',    unit: '200g', price: 45,  stock: 100 },
  { id: 'P069', name: 'Parle-G Biscuits',              category: 'Biscuits',         brand: 'Parle',        unit: '200g', price: 25,  stock: 150 },

];

module.exports = products;
