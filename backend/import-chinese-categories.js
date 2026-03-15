const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

console.log('🚀 Importing Products - Chinese Categories from Alibaba\n');

// 中文分类对应的产品数据
const productsByCategory = {
  '热卖': [
    { name: '2026时尚PU皮革油蜡单肩包别致斜挎包金属链条', price: 12.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H982baaae6ee541638277a721b5acb7fdt.jpg'] },
    { name: '2026批发PU皮革手提包定制LOGO油蜡大容量', price: 13.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H7d32458efbe14c4b9c0fa4fbef1b18a3g.jpg'] },
    { name: 'OEM ODM时尚大号单肩手提包定制奢华时尚女士手提包', price: 13.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf.jpg'] },
    { name: '热销时尚设计女士腋下包圆筒形定制LOGO', price: 12.60, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hb3ae072a3f1a4e1e88dc926a42f05139T.jpg'] },
    { name: '热销高品质纯素皮革女士单肩包便携手提包', price: 12.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hf37651b0bf1e4743b718a165cd45d326m.jpg'] },
    { name: '畅销2026新款时尚休闲手提单肩腋下包定制LOGO', price: 14.90, moq: '100件', images: ['https://sc04.alicdn.com/kf/H275a8dc8d547415baf5bfb8f2b7bcf7cu.jpg'] },
  ],
  '2026新来者': [
    { name: '2026秋季新款方形PU纯素皮革手提包时尚腋下包', price: 12.60, moq: '100件', images: ['https://sc04.alicdn.com/kf/H41644270e3a342fd96d93565c6df2da8L.jpg'] },
    { name: '2026新款定制厂家PU皮革高端设计斜挎包', price: 13.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H165b3f4fc7a6417884378b04e854e135J.jpg'] },
    { name: '2026 OEM ODM优质PU女士手提包大容量腋下单肩包', price: 13.90, moq: '100件', images: ['https://sc04.alicdn.com/kf/H0a7703a6c8be468aa3ad873a13b40650F.jpg'] },
    { name: '2026新款时尚韩版女士手提包简约大容量PU皮革', price: 13.90, moq: '100件', images: ['https://sc04.alicdn.com/kf/H1f88ea3ab4e5446dae218d7680304984L.jpg'] },
    { name: '2026 OEM ODM新潮流时尚女士手提包定制高品质PU奢华', price: 13.30, moq: '100件', images: ['https://sc04.alicdn.com/kf/H72685895f7c9406ea770bf393fc928dfj.jpg'] },
  ],
  '手提包': [
    { name: '2023新款手提包鳄鱼皮定制LOGO女士包', price: 15.00, moq: '100件', images: ['https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg'] },
    { name: '高品质时尚鳄鱼皮女士包奢华设计师手提包', price: 18.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H5b2cf23157a34091be64003622a849bdo.jpg'] },
    { name: '时尚设计师手提包女士奢华鳄鱼纹PU皮革', price: 16.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/H6f6c25b9542d4f1eadf3c8ae172fecb1H.jpg'] },
    { name: '优质女士手提包优雅设计PU皮革单肩包', price: 14.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hdb8ce640a0524e57b2e251ac9e5539cfO.jpg'] },
    { name: '奢华设计师手提包女士时尚PU皮革顶部手柄包', price: 17.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg'] },
  ],
  '手提袋': [
    { name: '定制女士笔记本电脑包PU皮革电脑手提袋大容量', price: 22.00, moq: '100件', images: ['https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg'] },
    { name: '大容量女士手提袋PU皮革购物袋时尚单肩包', price: 15.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H0a7703a6c8be468aa3ad873a13b40650F.jpg'] },
    { name: '批发定制大容量单肩包优雅PU包热销', price: 13.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hdb8ce640a0524e57b2e251ac9e5539cfO.jpg'] },
    { name: '时尚女士手提袋大容量PU皮革手提包工作包', price: 16.00, moq: '100件', images: ['https://sc04.alicdn.com/kf/H1f88ea3ab4e5446dae218d7680304984L.jpg'] },
    { name: '优质手提袋女士大号购物袋PU皮革单肩包', price: 14.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/H89cc22f8c99a4826acee5358b7db2a06f.jpg'] },
    { name: '优雅女士手提袋时尚PU皮革大容量手提包', price: 15.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hf01315beeb45423293e8044060bdd23bH.jpg'] },
  ],
  '肩包': [
    { name: '2026热销女士手提包定制LOGO时尚女士手提袋', price: 13.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/H5b2cf23157a34091be64003622a849bdo.jpg'] },
    { name: '热销款式高品质纯素皮革女士单肩包便携手提包', price: 12.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hf37651b0bf1e4743b718a165cd45d326m.jpg'] },
    { name: '时尚女士单肩包PU皮革优雅设计日常使用手提包', price: 13.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H41644270e3a342fd96d93565c6df2da8L.jpg'] },
    { name: '时尚单肩包女士时尚PU皮革休闲日常手提包', price: 12.90, moq: '100件', images: ['https://sc04.alicdn.com/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf.jpg'] },
    { name: '经典单肩包女士优雅设计PU皮革时尚手提包', price: 14.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/H7d32458efbe14c4b9c0fa4fbef1b18a3g.jpg'] },
  ],
  '斜挎包': [
    { name: '工厂批发OEM ODM女士扣包定制斜挎包带LOGO', price: 13.30, moq: '100件', images: ['https://sc04.alicdn.com/kf/H6f6c25b9542d4f1eadf3c8ae172fecb1H.jpg'] },
    { name: '时尚设计女士腋下包圆筒形定制LOGO女士单肩包', price: 12.60, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hb3ae072a3f1a4e1e88dc926a42f05139T.jpg'] },
    { name: '休闲斜挎包女士日常使用轻便单肩包', price: 11.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hf3342907a26e464e80014de79bb11b78Y.jpg'] },
    { name: '时尚斜挎包女士PU皮革小号单肩包信使包', price: 12.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/H165b3f4fc7a6417884378b04e854e135J.jpg'] },
    { name: '时尚斜挎包女士紧凑设计PU皮革单肩包', price: 11.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/H982baaae6ee541638277a721b5acb7fdt.jpg'] },
  ],
  '桶袋': [
    { name: '2026新款时尚休闲手提单肩腋下包定制LOGO时尚', price: 14.90, moq: '100件', images: ['https://sc04.alicdn.com/kf/H275a8dc8d547415baf5bfb8f2b7bcf7cu.jpg'] },
    { name: '时尚水桶包女士PU皮革抽绳单肩包可调节肩带', price: 13.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg'] },
    { name: '时尚水桶包女士时尚PU皮革抽绳封口单肩包', price: 14.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hdb8ce640a0524e57b2e251ac9e5539cfO.jpg'] },
    { name: '经典水桶包女士优雅设计PU皮革时尚手提包', price: 13.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/H0a7703a6c8be468aa3ad873a13b40650F.jpg'] },
  ],
  '背包': [
    { name: '2026 OEM ODM新潮流时尚女士手提包定制高品质PU', price: 13.30, moq: '100件', images: ['https://sc04.alicdn.com/kf/H72685895f7c9406ea770bf393fc928dfj.jpg'] },
    { name: '时尚设计女士腋下包圆筒形定制LOGO红色', price: 13.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hf01315beeb45423293e8044060bdd23bH.jpg'] },
    { name: '定制批发2026新款时尚潮流复古手提包高端麂皮', price: 13.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/H89cc22f8c99a4826acee5358b7db2a06f.jpg'] },
    { name: '时尚女士背包PU皮革休闲日常使用学校包', price: 16.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H1f88ea3ab4e5446dae218d7680304984L.jpg'] },
  ],
  '钱包和钱包': [
    { name: '女士皮革钱包长款钱包卡包手拿包时尚设计', price: 8.50, moq: '200件', images: ['https://sc04.alicdn.com/kf/H6f6c25b9542d4f1eadf3c8ae172fecb1H.jpg'] },
    { name: '时尚女士钱包PU皮革长款钱包卡包硬币袋', price: 9.20, moq: '200件', images: ['https://sc04.alicdn.com/kf/Hb3ae072a3f1a4e1e88dc926a42f05139T.jpg'] },
    { name: '优雅女士钱包PU皮革钱包卡包时尚配饰', price: 8.80, moq: '200件', images: ['https://sc04.alicdn.com/kf/H165b3f4fc7a6417884378b04e854e135J.jpg'] },
    { name: '经典女士钱包长款设计PU皮革钱包卡包', price: 9.50, moq: '200件', images: ['https://sc04.alicdn.com/kf/H982baaae6ee541638277a721b5acb7fdt.jpg'] },
  ],
  '尼龙和帆布系列': [
    { name: '休闲尼龙手提袋女士轻便购物袋时尚设计', price: 10.50, moq: '100件', images: ['https://sc04.alicdn.com/kf/H275a8dc8d547415baf5bfb8f2b7bcf7cu.jpg'] },
    { name: '时尚帆布单肩包女士休闲日常使用手提袋', price: 11.20, moq: '100件', images: ['https://sc04.alicdn.com/kf/He948805ce22140908f8011dc79d3f26cR.jpg'] },
    { name: '时尚尼龙斜挎包女士轻便信使包时尚', price: 10.80, moq: '100件', images: ['https://sc04.alicdn.com/kf/Hdb8ce640a0524e57b2e251ac9e5539cfO.jpg'] },
    { name: '经典帆布手提袋女士环保购物袋休闲设计', price: 9.90, moq: '100件', images: ['https://sc04.alicdn.com/kf/H0a7703a6c8be468aa3ad873a13b40650F.jpg'] },
  ],
};

// Clear existing products
console.log('🗑️  Clearing existing products...');
db.prepare('DELETE FROM products').run();
console.log('✓ Cleared\n');

// Insert products
let skuCounter = 1;
let totalInserted = 0;

for (const [category, products] of Object.entries(productsByCategory)) {
  console.log(`📦 导入 ${category}...`);
  
  for (const product of products) {
    const categorySlug = category.replace(/\s+/g, '-');
    const sku = `DY-${categorySlug.toUpperCase()}-${String(skuCounter).padStart(4, '0')}`;
    const comparePrice = (product.price * 1.3).toFixed(2);
    const imagesJson = JSON.stringify(product.images);
    
    const description = `广州达益皮具有限公司优质${category}。${product.name}。高品质材料，可定制设计，提供OEM/ODM服务。自1992年成立以来，我们是一家拥有30多年皮革制品生产经验的专业制造商。`;
    
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
      
      console.log(`   ✓ ${sku}: ${product.name.substring(0, 40)}...`);
      totalInserted++;
      skuCounter++;
    } catch (error) {
      console.log(`   ✗ 插入错误 ${sku}:`, error.message);
    }
  }
  
  console.log(`   → ${products.length} 个产品已导入\n`);
}

// Summary
console.log('='.repeat(70));
console.log('📊 导入摘要:');
console.log('='.repeat(70));

const categoryCounts = db.prepare(`
  SELECT category, COUNT(*) as count 
  FROM products 
  GROUP BY category 
  ORDER BY category
`).all();

categoryCounts.forEach(row => {
  console.log(`${row.category.padEnd(25)} ${row.count} 个产品`);
});

console.log('='.repeat(70));
console.log(`✅ 总计: ${totalInserted} 个独特产品导入成功！`);
console.log('='.repeat(70));

db.close();
