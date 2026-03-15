const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

console.log('🚀 Importing comprehensive product catalog from Alibaba...\n');

// Real products extracted from Alibaba International (sacdepinko.en.alibaba.com)
// Each category has unique, non-duplicate products
const productsByCategory = {
  'Handbags': [
    {
      name: '2026 Fashion PU Leather Oil Wax Shoulder Bag Chic Crossbody Bag with Metal Chain Messenger Style for Women\'s Daily Use',
      price: 12.50,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H982baaae6ee541638277a721b5acb7fdt.jpg']
    },
    {
      name: '2026 Wholesale PU Leather Tote Bag with Custom Logo Oil Wax Large Capacity Drawstring Design Casual Tote Handbag',
      price: 13.50,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H7d32458efbe14c4b9c0fa4fbef1b18a3g.jpg']
    },
    {
      name: 'OEM ODM Fashionable Large Shoulder Handbag Custom Luxury Stylish Women\'s Tote Bag',
      price: 13.80,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf.jpg']
    }
  ],
  'Tote Bags': [
    {
      name: 'Custom Laptop Bag for Women Pu Leather Computer Tote Bag Large Capacity Ladies Office Handbag',
      price: 22.00,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg']
    },
    {
      name: '2026 OEM ODM Premium Pu Ladies Hand Bag Large Capacity Underarm Shoulder Handbag Trending Stylish Tote Bag for Women',
      price: 13.90,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H0a7703a6c8be468aa3ad873a13b40650F.jpg']
    },
    {
      name: '2026 New Fashion Korean Female Tote Bag Simple Large Capacity PU Leather Shoulder Bag for Women Solid Color',
      price: 13.90,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H1f88ea3ab4e5446dae218d7680304984L.jpg']
    },
    {
      name: 'Wholesale Custom Large Capacity Shoulder Bag Elegant Pu Bag Trending Hot Sale Faux Suede Women Handbag Fashion Tote Bag',
      price: 13.80,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/Hdb8ce640a0524e57b2e251ac9e5539cfO.jpg']
    }
  ],
  'Shoulder Bags': [
    {
      name: '2026 Autumn New Square Pu Vegan Leather Handbag Stylish Underarm Bag Trendy Fashionable Korean Shoulder Bag for Women',
      price: 12.60,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H41644270e3a342fd96d93565c6df2da8L.jpg']
    },
    {
      name: '2026 Popular Hot Sale Women Handbags Custom Logo Fashion Ladies Tote Bags Trending Premium Suede Pu Women Shoulder Handbags',
      price: 13.20,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H5b2cf23157a34091be64003622a849bdo.jpg']
    },
    {
      name: 'Hot Sell Style High Quality Vegan Leather Lady Shoulder Bags Portable Hand Bag and Purses Women Armpit Bags',
      price: 12.80,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/Hf37651b0bf1e4743b718a165cd45d326m.jpg']
    }
  ],
  'Crossbody Bags': [
    {
      name: 'Factory Wholesale OEM ODM Ladies\' Buckle Bag Custom Crossbody Bag with Logo Fashionable Shoulder Bucket for Women',
      price: 13.30,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H6f6c25b9542d4f1eadf3c8ae172fecb1H.jpg']
    },
    {
      name: 'Trendy Fashion Design Women Underarm Bag Cylinder Shape Custom Logo Women\'s Shoulder Bags for Young Girls',
      price: 12.60,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/Hb3ae072a3f1a4e1e88dc926a42f05139T.jpg']
    },
    {
      name: '2026 New Custom Manufacturer Pu Leather High-End Design Crossbody Bags Fashionable Handbags Women\'s Handbag',
      price: 13.50,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H165b3f4fc7a6417884378b04e854e135J.jpg']
    }
  ],
  'Bucket Bags': [
    {
      name: '2026 New Fashion Casual Tote Shoulder Underarm Bag Custom Logo Stylish Women\'s Shoulder Bag Large-capacity Bucket Handbags',
      price: 14.90,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H275a8dc8d547415baf5bfb8f2b7bcf7cu.jpg']
    },
    {
      name: 'Fashion Bucket Bag Women PU Leather Drawstring Shoulder Bag with Adjustable Strap',
      price: 13.50,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg']
    }
  ],
  'Backpacks': [
    {
      name: '2026 OEM ODM New Trend Fashion Women Handbags Custom High Quality PU Luxury Shoulder Bags Simple Fashion Underarm Bag for Gril',
      price: 13.30,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H72685895f7c9406ea770bf393fc928dfj.jpg']
    },
    {
      name: 'Trendy Fashion Design Women Underarm Bag Cylinder Shape Custom Logo Women\'s Shoulder Bags for Young Girls Red',
      price: 13.20,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/Hf01315beeb45423293e8044060bdd23bH.jpg']
    },
    {
      name: 'Custom Wholesale 2026 New Fashion Trends Vintage Handbags High-end Suede Shoulder Tote Bag for Women',
      price: 13.80,
      moq: '100 Pieces',
      images: ['https://sc04.alicdn.com/kf/H89cc22f8c99a4826acee5358b7db2a06f.jpg']
    }
  ]
};

// Clear existing products
console.log('🗑️  Clearing existing products...');
db.prepare('DELETE FROM products').run();
console.log('✓ Cleared\n');

// Insert products
let skuCounter = 1;
let totalInserted = 0;

for (const [category, products] of Object.entries(productsByCategory)) {
  console.log(`📦 Importing ${category}...`);
  
  for (const product of products) {
    const sku = `DY-${category.toUpperCase().replace(/\s+/g, '-').replace(/&/g, 'AND')}-${String(skuCounter).padStart(4, '0')}`;
    const comparePrice = (product.price * 1.3).toFixed(2);
    const imagesJson = JSON.stringify(product.images);
    
    const description = `Premium ${category.toLowerCase()} from Guangzhou Dayi Leather Ltd. ${product.name}. High quality materials, customizable design, OEM/ODM services available. Established since 1992, we are a professional manufacturer with 30+ years of experience.`;
    
    try {
      db.prepare(`
        INSERT INTO products (sku, name, description, price, compare_price, stock, category, images, moq, source_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        sku,
        product.name,
        description,
        product.price,
        comparePrice,
        100,
        category,
        imagesJson,
        product.moq,
        'https://sacdepinko.en.alibaba.com/productlist.html'
      );
      
      console.log(`   ✓ ${sku}: ${product.name.substring(0, 60)}...`);
      totalInserted++;
      skuCounter++;
    } catch (error) {
      console.log(`   ✗ Error inserting ${sku}:`, error.message);
    }
  }
  
  console.log(`   → ${products.length} products imported\n`);
}

// Summary
console.log('='.repeat(70));
console.log('📊 Import Summary:');
console.log('='.repeat(70));

const categoryCounts = db.prepare(`
  SELECT category, COUNT(*) as count 
  FROM products 
  GROUP BY category 
  ORDER BY category
`).all();

categoryCounts.forEach(row => {
  console.log(`${row.category.padEnd(25)} ${row.count} products`);
});

console.log('='.repeat(70));
console.log(`✅ Total: ${totalInserted} unique products imported successfully!`);
console.log('='.repeat(70));

db.close();
