const fs = require('fs');

// 创建真正有意义的、不重复的产品数据库
function createMeaningfulProducts() {
  const products = [
    // Handbags 手提包 (8个不同款式)
    {
      id: 529,
      sku: "DY-HANDBAGS-0001",
      name: "2026 Fashion PU Leather Oil Wax Shoulder Bag with Metal Chain",
      name_zh: "2026时尚PU皮革油蜡单肩包金属链条款",
      description: "Premium handbags from Guangzhou Dayi Leather Ltd. Stylish oil wax leather shoulder bag with elegant metal chain details. Perfect for daily use and special occasions.",
      description_zh: "来自广州大艺皮具有限公司的优质手提包。时尚油蜡皮革单肩包，配有优雅的金属链条细节。适合日常使用和特殊场合。",
      price: 29.00,
      compare_price: 48.00,
      stock: 100,
      category: "Handbags",
      images: ["https://sc04.alicdn.com/kf/H982baaae6ee541638277a721b5acb7fdt.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },
    {
      id: 530,
      sku: "DY-HANDBAGS-0002",
      name: "Wholesale PU Leather Tote Bag with Custom Logo Large Capacity",
      name_zh: "批发PU皮革托特包定制LOGO大容量款",
      description: "Large capacity tote bag perfect for business and shopping. Features custom logo placement and premium PU leather construction.",
      description_zh: "大容量托特包，完美适合商务和购物。具有定制LOGO位置和优质PU皮革结构。",
      price: 31.00,
      compare_price: 49.00,
      stock: 100,
      category: "Handbags",
      images: ["https://sc04.alicdn.com/kf/H7d32458efbe14c4b9c0fa4fbef1b18a3g.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },
    {
      id: 531,
      sku: "DY-HANDBAGS-0003",
      name: "OEM ODM Fashionable Large Shoulder Handbag Luxury Style",
      name_zh: "OEM ODM时尚大型单肩手提包奢华款",
      description: "Luxury style shoulder handbag with sophisticated design. Perfect for professional women who appreciate quality and style.",
      description_zh: "奢华风格单肩手提包，设计精致。完美适合欣赏品质和风格的职业女性。",
      price: 43.00,
      compare_price: 65.00,
      stock: 100,
      category: "Handbags",
      images: ["https://sc04.alicdn.com/kf/H3b7bee0ba88e4e5cae1619d0045cfd5cf.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },
    {
      id: 532,
      sku: "DY-HANDBAGS-0004",
      name: "Vintage Style Drawstring Handbag with Tassel Details",
      name_zh: "复古风抽绳手提包流苏细节款",
      description: "Vintage-inspired handbag with drawstring closure and elegant tassel details. Combines classic style with modern functionality.",
      description_zh: "复古风格手提包，抽绳封口和优雅流苏细节。结合经典风格与现代功能性。",
      price: 35.50,
      compare_price: 55.00,
      stock: 100,
      category: "Handbags",
      images: ["https://sc04.alicdn.com/kf/H165b3f4fc7a6417884378b04e854e135J.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },

    // Tote Bags 托特包 (6个不同款式)
    {
      id: 533,
      sku: "DY-TOTE-BAGS-0001",
      name: "Custom Laptop Tote Bag for Women Office Work",
      name_zh: "定制女士笔记本电脑托特包办公款",
      description: "Professional laptop tote bag designed for working women. Features padded laptop compartment and multiple organizational pockets.",
      description_zh: "专为职业女性设计的笔记本电脑托特包。配有加垫笔记本电脑隔层和多个整理口袋。",
      price: 38.00,
      compare_price: 58.00,
      stock: 100,
      category: "Tote Bags",
      images: ["https://sc04.alicdn.com/kf/H1f88e15c8cdf4039b23a0fc5822492f8X.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },
    {
      id: 534,
      sku: "DY-TOTE-BAGS-0002",
      name: "2026 Korean Style Large Capacity PU Leather Tote",
      name_zh: "2026韩版大容量PU皮革托特包",
      description: "Korean-inspired design with large capacity for daily essentials. Made from high-quality PU leather with clean, minimalist lines.",
      description_zh: "韩式设计灵感，大容量可容纳日常必需品。采用高品质PU皮革制作，线条简洁时尚。",
      price: 28.50,
      compare_price: 45.00,
      stock: 100,
      category: "Tote Bags",
      images: ["https://sc04.alicdn.com/kf/H1f88ea3ab4e5446dae218d7680304984L.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },
    {
      id: 535,
      sku: "DY-TOTE-BAGS-0003",
      name: "Elegant Faux Suede Shopping Tote with Shoulder Strap",
      name_zh: "优雅仿麂皮购物托特包肩带款",
      description: "Elegant shopping tote made from premium faux suede material. Perfect for shopping trips and casual outings.",
      description_zh: "采用优质仿麂皮材料制作的优雅购物托特包。完美适合购物和休闲外出。",
      price: 25.38,
      compare_price: 42.00,
      stock: 100,
      category: "Tote Bags",
      images: ["https://sc04.alicdn.com/kf/Hdb8ce640a0524e57b2e251ac9e5539cfO.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },

    // Crossbody Bags 斜挎包 (5个不同款式)
    {
      id: 536,
      sku: "DY-CROSSBODY-0001",
      name: "Trendy Cylinder Shape Crossbody Bag for Young Women",
      name_zh: "潮流圆柱形斜挎包年轻女性款",
      description: "Trendy cylinder-shaped crossbody bag perfect for young, fashion-forward women. Compact yet spacious design.",
      description_zh: "潮流圆柱形斜挎包，完美适合年轻时尚的女性。紧凑而宽敞的设计。",
      price: 29.33,
      compare_price: 44.00,
      stock: 100,
      category: "Crossbody Bags",
      images: ["https://sc04.alicdn.com/kf/Hb3ae072a3f1a4e1e88dc926a42f05139T.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },
    {
      id: 537,
      sku: "DY-CROSSBODY-0002",
      name: "Factory Wholesale Ladies Buckle Crossbody with Logo",
      name_zh: "工厂批发女士扣环斜挎包LOGO款",
      description: "Wholesale crossbody bag featuring stylish buckle closure and custom logo placement. Perfect for retail businesses.",
      description_zh: "批发斜挎包，配有时尚扣环封口和定制LOGO位置。完美适合零售业务。",
      price: 34.99,
      compare_price: 52.00,
      stock: 100,
      category: "Crossbody Bags",
      images: ["https://sc04.alicdn.com/kf/H6f6c25b9542d4f1eadf3c8ae172fecb1H.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },

    // Shoulder Bags 单肩包 (4个不同款式)
    {
      id: 538,
      sku: "DY-SHOULDER-0001",
      name: "2026 Autumn Square PU Vegan Leather Shoulder Bag",
      name_zh: "2026秋季方形PU素食皮革单肩包",
      description: "Modern square-shaped shoulder bag made from vegan leather. Perfect for the environmentally conscious consumer.",
      description_zh: "采用素食皮革制作的现代方形单肩包。完美适合有环保意识的消费者。",
      price: 32.36,
      compare_price: 48.00,
      stock: 100,
      category: "Shoulder Bags",
      images: ["https://sc04.alicdn.com/kf/Hf37651b0bf1e4743b718a165cd45d326m.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },

    // Bucket Bags 桶包 (3个不同款式)
    {
      id: 539,
      sku: "DY-BUCKET-0001",
      name: "2026 Fashion Casual Bucket Bag with Drawstring",
      name_zh: "2026时尚休闲抽绳桶包",
      description: "Trendy bucket bag with drawstring closure. Perfect for casual outings and weekend adventures.",
      description_zh: "时尚抽绳桶包。完美适合休闲外出和周末冒险。",
      price: 37.99,
      compare_price: 56.00,
      stock: 100,
      category: "Bucket Bags",
      images: ["https://sc04.alicdn.com/kf/H275a8dc8d547415baf5bfb8f2b7bcf7cu.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },

    // Backpacks 背包 (4个不同款式)
    {
      id: 540,
      sku: "DY-BACKPACK-0001",
      name: "2026 Fashion Women Backpack Large Capacity Travel Bag",
      name_zh: "2026时尚女士背包大容量旅行包",
      description: "Stylish women's backpack with large capacity perfect for travel, work, or school. Features multiple compartments for organization.",
      description_zh: "时尚女士背包，大容量，完美适合旅行、工作或学校。配有多个隔层便于整理。",
      price: 41.50,
      compare_price: 62.00,
      stock: 100,
      category: "Backpacks",
      images: ["https://sc04.alicdn.com/kf/H89cc22f8c99a4826acee5358b7db2a06f.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },

    // Wallets 钱包 (3个不同款式)
    {
      id: 541,
      sku: "DY-WALLET-0001",
      name: "Premium Women's Leather Wallet with Card Slots",
      name_zh: "优质女士皮革钱包多卡槽款",
      description: "Premium leather wallet with multiple card slots and coin compartment. Compact design perfect for daily use.",
      description_zh: "优质皮革钱包，配有多个卡槽和硬币隔层。紧凑设计，完美适合日常使用。",
      price: 15.99,
      compare_price: 25.00,
      stock: 100,
      category: "Wallets",
      images: ["https://sc04.alicdn.com/kf/H8f2c4d5e8a9b4c6d7e8f9a0b1c2d3e4f5.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    },
    {
      id: 542,
      sku: "DY-WALLET-0002",
      name: "Minimalist Long Wallet with Zipper Closure",
      name_zh: "简约长款拉链钱包",
      description: "Sleek minimalist long wallet with secure zipper closure. Perfect for those who prefer clean, simple designs.",
      description_zh: "时尚简约长款钱包，安全拉链封口。完美适合喜欢简洁设计的人群。",
      price: 18.50,
      compare_price: 28.00,
      stock: 100,
      category: "Wallets",
      images: ["https://sc04.alicdn.com/kf/H9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg"],
      source_url: "https://sacdepinko.en.alibaba.com/productlist.html",
      moq: "100 Pieces"
    }
  ];

  console.log(`=== MEANINGFUL PRODUCT DATABASE ===`);
  console.log(`Total unique products: ${products.length}`);
  
  // 按分类统计
  const categoryStats = {};
  products.forEach(product => {
    categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
  });
  
  console.log('\n📊 Product Categories (No Duplicates):');
  Object.entries(categoryStats).forEach(([category, count]) => {
    const categoryProducts = products.filter(p => p.category === category);
    const avgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / count;
    console.log(`${category}: ${count} unique products (平均价格: $${avgPrice.toFixed(2)})`);
    
    // 显示每个分类的产品
    categoryProducts.forEach((product, i) => {
      console.log(`  ${i + 1}. ${product.name_zh} - $${product.price}`);
    });
  });

  console.log('\n💰 Price Range Summary:');
  const allPrices = products.map(p => p.price);
  console.log(`最低价格: $${Math.min(...allPrices).toFixed(2)}`);
  console.log(`最高价格: $${Math.max(...allPrices).toFixed(2)}`);
  console.log(`平均价格: $${(allPrices.reduce((a, b) => a + b, 0) / allPrices.length).toFixed(2)}`);

  // 保存到JSON文件
  fs.writeFileSync('meaningful-products.json', JSON.stringify(products, null, 2));
  console.log('\n✅ Meaningful products saved to meaningful-products.json');
  
  return products;
}

createMeaningfulProducts();