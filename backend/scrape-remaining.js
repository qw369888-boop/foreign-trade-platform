const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/foreign_trade.db');
const db = new Database(dbPath);

console.log('🚀 继续抓取剩余分类\n');

// 剩余的分类
const categories = [
  { name: '肩包', url: 'https://sacdepinko.en.alibaba.com/productgrouplist-910310605-5/Shoulder_Bags.html' },
  { name: '斜挎包', url: 'https://sacdepinko.en.alibaba.com/productgrouplist-910310605-6/Crossbody_Bags.html' },
  { name: '桶袋', url: 'https://sacdepinko.en.alibaba.com/productgrouplist-910310605-7/Bucket_Bags.html' },
  { name: '背包', url: 'https://sacdepinko.en.alibaba.com/productgrouplist-910310605-8/Backpacks.html' },
  { name: '钱包和钱包', url: 'https://sacdepinko.en.alibaba.com/productgrouplist-910310605-9/Purse_Wallet.html' },
  { name: '尼龙和帆布系列', url: 'https://sacdepinko.en.alibaba.com/productgrouplist-910310605-10/Nylon_Canvas_Collections.html' }
];

// 获取当前最大 SKU 编号
const maxSku = db.prepare('SELECT MAX(CAST(SUBSTR(sku, -4) AS INTEGER)) as max FROM products').get();
let skuCounter = (maxSku.max || 0) + 1;

async function scrapeCategory(browser, category) {
  console.log(`\n📦 正在抓取: ${category.name}`);
  console.log(`   URL: ${category.url}`);
  
  let page;
  try {
    page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('   ⏳ 正在加载页面...');
    await page.goto(category.url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    
    // 等待页面加载
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('   ⏳ 提取产品信息...');
    
    // 提取产品信息
    const products = await page.evaluate(() => {
      const items = [];
      
      const selectors = [
        '.organic-list-offer',
        '.product-item',
        '[data-content="product"]',
        '.list-item',
        'a[href*="product"]'
      ];
      
      let productElements = [];
      for (const selector of selectors) {
        productElements = document.querySelectorAll(selector);
        if (productElements.length > 0) break;
      }
      
      productElements.forEach((el) => {
        try {
          const titleEl = el.querySelector('.organic-list-offer-title, .title, h2, h3, a[title]');
          const name = titleEl ? (titleEl.getAttribute('title') || titleEl.textContent.trim()) : '';
          
          const priceEl = el.querySelector('.organic-list-offer-price, .price, [class*="price"]');
          let price = 0;
          if (priceEl) {
            const priceText = priceEl.textContent.trim();
            const priceMatch = priceText.match(/[\d.]+/);
            price = priceMatch ? parseFloat(priceMatch[0]) : 0;
          }
          
          const imgEl = el.querySelector('img');
          const image = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || '') : '';
          
          const moqEl = el.querySelector('[class*="moq"], [class*="MOQ"]');
          const moq = moqEl ? moqEl.textContent.trim() : '100 Pieces';
          
          if (name && image && name.length > 10) {
            items.push({
              name: name.substring(0, 200),
              price: price || 12.50,
              moq: moq,
              image: image.replace(/^\/\//, 'https://')
            });
          }
        } catch (err) {
          // 忽略单个产品错误
        }
      });
      
      return items;
    });
    
    console.log(`   ✅ 找到 ${products.length} 个产品`);
    
    // 插入数据库
    let inserted = 0;
    for (const product of products) {
      const categorySlug = category.name.replace(/\s+/g, '-');
      const sku = `DY-${categorySlug}-${String(skuCounter).padStart(4, '0')}`;
      const comparePrice = (product.price * 1.3).toFixed(2);
      const imagesJson = JSON.stringify([product.image]);
      
      const description = `广州达益皮具有限公司优质${category.name}。${product.name}。高品质材料，可定制设计，提供OEM/ODM服务。自1992年成立以来，我们是一家拥有30多年皮革制品生产经验的专业制造商。`;
      
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
          category.name,
          imagesJson,
          product.moq,
          category.url
        );
        
        console.log(`   ✓ ${sku}: ${product.name.substring(0, 50)}...`);
        inserted++;
        skuCounter++;
      } catch (error) {
        console.log(`   ✗ 插入错误: ${error.message}`);
      }
    }
    
    console.log(`   → ${inserted} 个产品已导入`);
    
    await page.close();
    return inserted;
    
  } catch (error) {
    console.error(`   ❌ 错误: ${error.message}`);
    if (page) {
      try {
        await page.close();
      } catch (e) {
        // 忽略关闭错误
      }
    }
    return 0;
  }
}

async function main() {
  console.log('🌐 启动浏览器...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  let totalInserted = 0;
  
  // 抓取每个分类
  for (const category of categories) {
    const inserted = await scrapeCategory(browser, category);
    totalInserted += inserted;
    
    // 等待一下，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  await browser.close();
  
  // 总结
  console.log('\n' + '='.repeat(70));
  console.log('📊 抓取摘要:');
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
  
  const totalCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  
  console.log('='.repeat(70));
  console.log(`✅ 本次新增: ${totalInserted} 个产品`);
  console.log(`✅ 数据库总计: ${totalCount.count} 个产品`);
  console.log('='.repeat(70));
  
  db.close();
}

main().catch(error => {
  console.error('❌ 致命错误:', error);
  db.close();
  process.exit(1);
});
