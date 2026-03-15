const Database = require('better-sqlite3');
const path = require('path');

// 数据库路径
const dbPath = path.resolve(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

// 从阿里巴巴抓取的完整产品数据（基于实际页面内容）
const alibabaProducts = [
  // 2025 New Arrivals
  {
    subject: "2023 New Arrival Handbag Crocodile Leather Customized Shoulder Woman Vintage Washed Bags Green Zipper Tote Bag With Gold Belt",
    price: "$12.06-17.01",
    moq: "100 pieces",
    category: "Tote Bags",
    images: [
      "https://sc04.alicdn.com/kf/Hf3342907a26e464e80014de79bb11b78Y.jpg",
      "https://sc04.alicdn.com/kf/Ha86350ec40d442609b03f1b2e42ef30dD.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/2023-New-Arrival-Handbag-Crocodile-Leather_1600903149654.html"
  },
  {
    subject: "Custom Laptop Bag for Women Pu Leather Computer Tote Bag Large Capacity Ladies Office Handbag",
    price: "$14.20-19.20",
    moq: "100 pieces",
    category: "Tote Bags",
    images: [
      "https://sc04.alicdn.com/kf/H6d0ecb70d561426195783cbb4b35f67cv.jpg",
      "https://sc04.alicdn.com/kf/Hca8d5ab0a4a448d1b5443521c391ecbcl.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/Custom-Laptop-Bag-for-Women-Pu_1600906125508.html"
  },
  {
    subject: "High Quality Nice Trending Croc Leather Women Bags Luxury Nice Design Ladies Tote Bags Handbag and Purse",
    price: "$8.50-18.50",
    moq: "100 pieces",
    category: "Tote Bags",
    images: [
      "https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg",
      "https://sc04.alicdn.com/kf/Ha8c9377fa5fc4ca786ebba70099b2ae1o.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/High-Quality-Nice-Trending-Croc-Leather_1600906444587.html"
  },
  {
    subject: "Custom Logo Fashion Classic Women's Handbags Pu Vegan Leather Ladies Shoulder Bag Small Flap Purses and Handbags",
    price: "$10.74-15.28",
    moq: "100 pieces",
    category: "Shoulder Bags",
    images: [
      "https://sc04.alicdn.com/kf/Hbea1befbf4aa4e9ea3e2073191b32cbfz.jpg",
      "https://sc04.alicdn.com/kf/H1a139596dfdf411ea3655ce31dff1d207.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/Custom-Logo-Fashion-Classic-Women-s_1600907327217.html"
  },
  {
    subject: "Custom Fashion Tote Bags Ladies Spring Pu Leather and Fluffy Women Handbags Large Capacity Shoulder Bag",
    price: "$9.50-22",
    moq: "100 pieces",
    category: "Tote Bags",
    images: [
      "https://sc04.alicdn.com/kf/H0209757b23a446d7abf8f8195d501599J.jpg",
      "https://sc04.alicdn.com/kf/H08217f572d2b40f09e4912471564e729s.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/Custom-Fashion-Tote-Bags-Ladies-Spring_1600913588337.html"
  },
  {
    subject: "Korea Style Casual Ladies Handbags Custom Classic Black Pu Leather Hand Bag for Luxury Women",
    price: "$12-18.50",
    moq: "100 pieces",
    category: "Handbags",
    images: [
      "https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg",
      "https://sc04.alicdn.com/kf/H452e0044b1d64fb0b9243eb65314590co.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/Korea-Style-Casual-Ladies-Handbags-Custom_1600918383417.html"
  },
  {
    subject: "New Arrival 2023 Fashion Purses and Handbags Customized Logo Ladies Handbags Luxury PU Leather Shoulder Bag",
    price: "$12.20-17.80",
    moq: "100 pieces",
    category: "Shoulder Bags",
    images: [
      "https://sc04.alicdn.com/kf/Haee265f0aca34767b1a58737945de8b5c.jpg",
      "https://sc04.alicdn.com/kf/H61c41258e01a4801860b779d5c2931ee3.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/New-Arrival-2023-Fashion-Purses-and_1600919387670.html"
  },
  {
    subject: "Fashion New Style Nice Trending Style Pu Hand Bag Large Capacity Women'S Shoulder Banquet Ladies Bag Crossbody Bag",
    price: "$13.40-17.50",
    moq: "100 pieces",
    category: "Crossbody Bags",
    images: [
      "https://sc04.alicdn.com/kf/H715c91f9e2b741ce8ff5eb6bae8e9013P.jpg",
      "https://sc04.alicdn.com/kf/Hee57bb7f1a0d4185824ce2805d99b7cb5.jpg"
    ],
    url: "https://www.alibaba.com/product-detail/Fashion-New-Style-Nice-Trending-Style_1600922449469.html"
  }
];

// 解析价格范围
function parsePrice(priceStr) {
  const match = priceStr.match(/\$?([\d.]+)(?:-[\d.]+)?/);
  return match ? parseFloat(match[1]) : 0;
}

// 生成 SKU
function generateSKU(index) {
  return `DY-BAG-${String(index + 1).padStart(4, '0')}`;
}

// 清空现有产品
console.log('🗑️  Clearing existing products...\n');
db.prepare('DELETE FROM products').run();

console.log('🚀 Starting Alibaba product import...\n');

// 导入产品
console.log(`Importing ${alibabaProducts.length} products...\n`);

const stmt = db.prepare(`
  INSERT INTO products 
  (sku, name, description, price, compare_price, stock, category, images, source_url, moq)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

alibabaProducts.forEach((product, index) => {
  const sku = generateSKU(index);
  const price = parsePrice(product.price);
  const comparePrice = price * 1.3;
  const images = JSON.stringify(product.images);
  
  const description = `Premium ${product.category.toLowerCase()} from Guangzhou Dayi Leather Ltd. ${product.subject}. High quality materials, customizable design, OEM/ODM services available.`;
  
  stmt.run(
    sku,
    product.subject,
    description,
    price,
    comparePrice,
    100,
    product.category,
    images,
    product.url,
    product.moq
  );
  
  console.log(`✓ Imported: ${product.subject.substring(0, 60)}...`);
});

console.log(`\n✅ Successfully imported ${alibabaProducts.length} products!`);

// 统计每个分类的产品数量
console.log('\n📊 Category distribution:');
const categories = ['Handbags', 'Shoulder Bags', 'Crossbody Bags', 'Tote Bags', 'Purses & Wallets', 'Backpacks'];

categories.forEach(cat => {
  const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE category = ?').get(cat);
  if (count.count > 0) {
    console.log(`  ${cat}: ${count.count} products`);
  }
});

console.log('\n🎉 All products are now available on your website!');
console.log('   Visit http://localhost:3007 to see them.\n');

db.close();
